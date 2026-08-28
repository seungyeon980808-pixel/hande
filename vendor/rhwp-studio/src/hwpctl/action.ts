/**
 * hwpctl Action 호환 클래스
 *
 * 한컴 웹기안기의 Action과 동일한 인터페이스를 제공한다.
 * CreateAction(id) → Action.CreateSet() → Action.Execute(set)
 */
import { ParameterSet } from './parameter-set';
import type { HwpCtrl } from './index';

/** Action 실행 함수 타입 */
export type ActionExecutor = (ctrl: HwpCtrl, set: ParameterSet | null) => boolean;

/**
 * 정책상 지원하지 않는 액션의 사유 (#3648).
 *
 * "아직 구현하지 않았다"(`executor: null`)와 **다른 사실**이다. 전자는 언젠가 채워질 자리이고
 * 이쪽은 채우지 않기로 판정된 자리다. 둘을 같은 `false` 로 뭉개면 호출자가 기다려야 하는지
 * 설계를 바꿔야 하는지 알 수 없다.
 */
export interface ActionUnsupportedReason {
  /** 기계가 분기할 코드. */
  code: 'notSupportedByDesign';
  /** 사람이 읽을 사유. */
  message: string;
  /** 판정 근거 — 호출자가 문서로 갈 수 있어야 한다. */
  reference: string;
}

/** Action 정의 */
export interface ActionDef {
  /** Action ID */
  id: string;
  /** 연결된 ParameterSet 이름 (없으면 null) */
  parameterSetId: string | null;
  /** 설명 */
  description: string;
  /** 실행 함수 */
  executor: ActionExecutor | null;
  /**
   * 설정되면 이 액션은 **정책상 미지원**이다 (#3648).
   *
   * 등록 자체는 유지한다 — 등록을 지우면 호출자에게 "오타로 없는 액션을 불렀다"와
   * "의도적으로 지원하지 않는다"가 똑같이 `미등록` 으로 보인다. 등록을 남기고 사유를 실어야
   * 호출자가 그 둘을 구분해 문서로 갈 수 있다.
   */
  unsupported?: ActionUnsupportedReason;
}

/** 액션의 지원 상태 — `HwpCtrl.GetActionSupport` 의 응답 (#3648). */
export type ActionSupport =
  | { status: 'supported' }
  /** 등록돼 있지만 아직 executor 가 없다 — 구현 대기. */
  | { status: 'unimplemented' }
  /** 등록돼 있고 정책상 지원하지 않는다. */
  | ({ status: 'unsupported' } & ActionUnsupportedReason);

export class Action {
  readonly ActID: string;
  readonly SetID: string | null;
  private ctrl: HwpCtrl;
  private def: ActionDef;

  constructor(ctrl: HwpCtrl, def: ActionDef) {
    this.ctrl = ctrl;
    this.def = def;
    this.ActID = def.id;
    this.SetID = def.parameterSetId;
  }

  /** Action에 연결된 ParameterSet 생성 */
  CreateSet(): ParameterSet {
    return new ParameterSet(this.def.parameterSetId || this.def.id);
  }

  /** ParameterSet에 기본값 로드 */
  GetDefault(set: ParameterSet): void {
    // Wave별 구현에서 기본값 설정 추가
  }

  /**
   * 정책상 미지원 액션이면 사유를 알리고 `true` 를 돌려준다 (#3648).
   *
   * `Run`/`Execute` 의 반환형은 한컴 `HwpCtrl` 호환이라 `boolean` 고정이다. 그래서 사유는
   * 로그로 알리고, 기계가 읽어야 하면 `HwpCtrl.GetActionSupport(id)` 로 조회한다 —
   * iframe 안 콘솔은 통합자에게 보이지 않으므로 조회 경로가 있어야 한다.
   */
  private reportUnsupported(): boolean {
    const reason = this.def.unsupported!;
    console.warn(
      `[hwpctl] Action "${this.def.id}" 미지원(${reason.code}): ${reason.message}`
      + ` — 근거: ${reason.reference}`
      + ` (기계 판독은 GetActionSupport("${this.def.id}") 사용)`,
    );
    return false;
  }

  /** Action 실행 (ParameterSet 전달) */
  Execute(set: ParameterSet): boolean {
    if (this.def.unsupported) return this.reportUnsupported();
    if (this.def.executor) {
      return this.def.executor(this.ctrl, set);
    }
    console.warn(`[hwpctl] Action "${this.def.id}" 미구현`);
    return false;
  }

  /** Action 단순 실행 (ParameterSet 없이) */
  Run(): boolean {
    if (this.def.unsupported) return this.reportUnsupported();
    if (this.def.executor) {
      return this.def.executor(this.ctrl, null);
    }
    console.warn(`[hwpctl] Action "${this.def.id}" 미구현`);
    return false;
  }
}
