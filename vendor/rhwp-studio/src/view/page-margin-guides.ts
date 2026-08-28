import type { PageInfo } from '../core/types';

export interface PageSpaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 편집 용지 여백 가이드라인을 캔버스에 그린다 (4모서리 L자 표시). */
export function drawPageMarginGuides(
  pageInfo: PageInfo,
  canvas: HTMLCanvasElement,
  scale: number,
  clip?: PageSpaceRect,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    marginHeader,
    marginFooter,
  } = pageInfo;
  const left = marginLeft;
  // 한컴 HWP 기준: 본문 시작 = marginHeader + marginTop
  const top = marginHeader + marginTop;
  const right = width - marginRight;
  // 한컴 HWP 기준: 본문 끝 = height - marginFooter - marginBottom
  const bottom = height - marginFooter - marginBottom;
  const L = 15;

  ctx.save();
  // WASM 렌더링 후 ctx transform 상태가 불확실하므로 명시적으로 설정
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (clip) {
    // partial replay가 지운 영역만 가이드를 복구한다. 이 clip이 없으면 patch 밖의
    // subpixel stroke가 타건마다 누적되어 점점 진해진다.
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();
  }
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 0.3;
  ctx.beginPath();

  // 좌상 코너
  ctx.moveTo(left, top - L);
  ctx.lineTo(left, top);
  ctx.lineTo(left - L, top);

  // 우상 코너
  ctx.moveTo(right + L, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right, top - L);

  // 좌하 코너
  ctx.moveTo(left - L, bottom);
  ctx.lineTo(left, bottom);
  ctx.lineTo(left, bottom + L);

  // 우하 코너
  ctx.moveTo(right, bottom + L);
  ctx.lineTo(right, bottom);
  ctx.lineTo(right + L, bottom);

  ctx.stroke();
  ctx.restore();
}
