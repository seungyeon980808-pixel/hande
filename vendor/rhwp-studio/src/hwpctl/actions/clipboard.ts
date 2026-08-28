/**
 * Wave 5: 클립보드 + 실행취소 Action executors
 * Copy, Cut, Paste, Undo, Redo
 */
import { registerAction } from '../action-registry';
import type { HwpCtrl } from '../index';
import type { ParameterSet } from '../parameter-set';

function executeCopy(ctrl: HwpCtrl, _set: ParameterSet | null): boolean {
  const doc = ctrl.getWasmDoc();
  const cursor = ctrl.getCursor();
  try {
    doc.copySelection(cursor.section, cursor.para, 0, cursor.para, 65535);
    return true;
  } catch (e) {
    console.error('[hwpctl] Copy 실패:', e);
    return false;
  }
}

function executeCut(ctrl: HwpCtrl, _set: ParameterSet | null): boolean {
  const doc = ctrl.getWasmDoc();
  const cursor = ctrl.getCursor();
  try {
    doc.copySelection(cursor.section, cursor.para, 0, cursor.para, 65535);
    doc.deleteText(cursor.section, cursor.para, 0, 65535);
    return true;
  } catch (e) {
    console.error('[hwpctl] Cut 실패:', e);
    return false;
  }
}

function executePaste(ctrl: HwpCtrl, _set: ParameterSet | null): boolean {
  const doc = ctrl.getWasmDoc();
  const cursor = ctrl.getCursor();
  try {
    const result = doc.pasteInternal(cursor.section, cursor.para, cursor.pos);
    const parsed = JSON.parse(result);
    if (parsed.ok && parsed.charOffset !== undefined) {
      ctrl.SetPos(cursor.section, cursor.para, parsed.charOffset);
    }
    return parsed.ok === true;
  } catch (e) {
    console.error('[hwpctl] Paste 실패:', e);
    return false;
  }
}

/**
 * Undo/Redo 는 **정책상 미지원**이다 (#3648 판정, 2026-07-31).
 *
 * hwpctl 은 자동화·임베드 표면이고 소비자는 스크립트다. 스크립트는 자기 트랜잭션 경계를 알기에
 * "N 개 작업 후 되돌리기"는 호출자가 문서 사본으로 관리할 문제로 판정됐다. 히스토리 경유는
 * 자동화 레이어를 studio 앱 레이어에 종속시켜 의존 방향을 뒤집는다.
 *
 * 종전에는 `console.warn('미구현 (향후 Phase 4에서 구현)')` + `false` 였다. 그 메시지는 두 번
 * 틀렸다 — 구현 대기가 아니라 미지원이고, iframe 안 콘솔은 통합자에게 보이지 않는다.
 */
const UNDO_UNSUPPORTED = {
  code: 'notSupportedByDesign',
  message:
    'hwpctl 은 히스토리를 경유하지 않는 자동화 표면입니다. '
    + '되돌리기는 호출자가 문서 사본으로 관리하세요. undo/redo 는 studio UI 레이어 기능입니다.',
  reference: 'https://github.com/edwardkim/rhwp/issues/3648',
} as const;

// Action 등록
registerAction({ id: 'Copy', parameterSetId: null, description: '복사', executor: executeCopy });
registerAction({ id: 'Cut', parameterSetId: null, description: '잘라내기', executor: executeCut });
registerAction({ id: 'Paste', parameterSetId: null, description: '붙여넣기', executor: executePaste });
// 등록은 유지한다 — 지우면 호출자에게 오타와 의도적 미지원이 똑같이 보인다 (#3648).
registerAction({
  id: 'Undo',
  parameterSetId: null,
  description: '실행취소 (hwpctl 미지원)',
  executor: null,
  unsupported: UNDO_UNSUPPORTED,
});
registerAction({
  id: 'Redo',
  parameterSetId: null,
  description: '다시실행 (hwpctl 미지원)',
  executor: null,
  unsupported: UNDO_UNSUPPORTED,
});
