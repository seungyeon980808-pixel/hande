import type { CursorRect } from '@/core/types';
import { VirtualScroll } from '@/view/virtual-scroll';

/** 한 필드가 차지하는 화면 영역. 시작·끝 캐럿 사각형에서 계산한다. */
export type FieldHighlightRect =
  | { kind: 'caret'; startRect: CursorRect; endRect: CursorRect }
  /** 표 안 누름틀은 칸 전체를 칠한다. 좌표는 페이지 기준이다. */
  | { kind: 'cell'; pageIndex: number; x: number; y: number; w: number; h: number };

/**
 * 양식 모드에서 내가 작성해야 할 누름틀에 음영을 깔아 준다.
 *
 * 낫표 마커(FieldMarkerRenderer)는 커서가 들어간 필드 하나만 표시하므로,
 * 문서를 처음 연 사람은 어디를 써야 하는지 알 수 없다. 이 렌더러는
 * 담당 필드 전부를 상시 표시해 "내가 쓸 곳은 여기 세 군데"가 한눈에
 * 보이게 한다. 엑셀에서 잠긴 시트의 입력 가능 셀만 도드라지는 것과 같다.
 *
 * 캔버스를 건드리지 않고 절대 위치 DIV 를 겹쳐 그린다.
 */
export class FieldHighlightRenderer {
  private layer: HTMLDivElement;
  private boxes: HTMLDivElement[] = [];
  private rects: FieldHighlightRect[] = [];
  private enabled = false;

  constructor(
    private container: HTMLElement,
    private virtualScroll: VirtualScroll,
  ) {
    this.layer = document.createElement('div');
    this.layer.className = 'field-highlight-layer';
    this.layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:8;display:none;';
    this.attach();
  }

  private attach(): void {
    if (this.layer.isConnected) return;
    const scrollContent = this.container.querySelector('#scroll-content');
    (scrollContent ?? this.container).appendChild(this.layer);
  }

  /** 표시할 필드 영역을 갈아 끼운다. 빈 배열이면 음영이 사라진다. */
  setRects(rects: FieldHighlightRect[], zoom: number): void {
    this.rects = rects;
    this.enabled = rects.length > 0;
    this.render(zoom);
  }

  /** 스크롤·확대축소 후 위치를 다시 잡는다. */
  render(zoom: number): void {
    if (!this.enabled) {
      this.layer.style.display = 'none';
      return;
    }
    this.attach();
    this.layer.style.display = 'block';

    while (this.boxes.length < this.rects.length) {
      const box = document.createElement('div');
      box.className = 'field-highlight-box';
      this.layer.appendChild(box);
      this.boxes.push(box);
    }
    for (let i = this.rects.length; i < this.boxes.length; i += 1) {
      this.boxes[i].style.display = 'none';
    }

    this.rects.forEach((rect, index) => {
      const box = this.boxes[index];
      const style = 'position:absolute;pointer-events:none;'
        + 'background:rgba(250,204,21,0.28);'
        + 'border:1px dashed rgba(202,138,4,0.85);'
        + 'border-radius:2px;box-sizing:border-box;';

      if (rect.kind === 'cell') {
        // 칸 전체를 칠한다. 빈 누름틀은 폭이 0 이라 글자 기준으로 잡으면
        // 좁은 띠가 되어, 그 자리를 정확히 눌러야만 쓸 수 있는 것처럼 보인다.
        const pageOffset = this.virtualScroll.getPageOffset(rect.pageIndex);
        const pageLeft = this.calcPageLeft(rect.pageIndex);
        box.style.cssText = style;
        box.style.left = `${pageLeft + rect.x * zoom}px`;
        box.style.top = `${pageOffset + rect.y * zoom}px`;
        box.style.width = `${rect.w * zoom}px`;
        box.style.height = `${rect.h * zoom}px`;
        box.style.display = 'block';
        return;
      }

      const { startRect, endRect } = rect;
      // 시작과 끝이 다른 줄/페이지로 갈라지면 시작 줄만 칠한다.
      // 줄바꿈된 누름틀까지 정확히 덮으려면 줄 단위 사각형이 필요한데,
      // 현재 API 로는 얻을 수 없다. 위치를 알리는 목적에는 시작 줄로 충분하다.
      const sameLine = startRect.pageIndex === endRect.pageIndex
        && Math.abs(startRect.y - endRect.y) < 1;
      const pageOffset = this.virtualScroll.getPageOffset(startRect.pageIndex);
      const pageLeft = this.calcPageLeft(startRect.pageIndex);
      const left = pageLeft + startRect.x * zoom;
      const width = sameLine
        ? Math.max((endRect.x - startRect.x) * zoom, 6 * zoom)
        : 24 * zoom;

      box.style.cssText = style;
      box.style.left = `${left}px`;
      box.style.top = `${pageOffset + startRect.y * zoom}px`;
      box.style.width = `${width}px`;
      box.style.height = `${startRect.height * zoom}px`;
      box.style.display = 'block';
    });
  }

  /** 페이지의 화면 X 좌표. 낫표 마커와 같은 규칙을 쓴다. */
  private calcPageLeft(pageIndex: number): number {
    const gridLeft = this.virtualScroll.getPageLeft(pageIndex);
    if (gridLeft >= 0) return gridLeft;
    const scrollContent = this.container.querySelector('#scroll-content');
    const contentWidth = scrollContent?.clientWidth ?? 0;
    const pageDisplayWidth = this.virtualScroll.getPageWidth(pageIndex);
    return (contentWidth - pageDisplayWidth) / 2;
  }

  hide(): void {
    this.enabled = false;
    this.rects = [];
    this.layer.style.display = 'none';
  }

  dispose(): void {
    this.layer.remove();
    this.boxes = [];
    this.rects = [];
  }
}
