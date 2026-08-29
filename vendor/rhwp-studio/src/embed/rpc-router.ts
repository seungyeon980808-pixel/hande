import type { HmlSaveState } from '../core/hml-save-capability.ts';
import type {
  CanvasKitRenderModeRequest,
  CanvasKitSurfaceRequest,
  LayerRenderProfile,
  RenderBackend,
  RenderBackendRequest,
} from '../view/render-backend.ts';

export interface EmbedNotifySavedResult {
  ok: true;
  wasDirty: boolean;
}

export interface EmbedRpcHandlers {
  ready(): Promise<boolean>;
  loadFile(
    data: Uint8Array,
    fileName: string,
    skipUnsavedGuard: boolean,
    suppressDialogs: boolean,
  ): Promise<{ pageCount: number }>;
  pageCount(): Promise<number>;
  getRendererDiagnostics(page: number): Promise<EmbedRendererDiagnosticsV1>;
  getPageSvg(page: number): Promise<string>;
  exportHwp(): Promise<Uint8Array>;
  exportHwpx(): Promise<Uint8Array>;
  exportHml(): Promise<Uint8Array>;
  getHmlSaveState(): Promise<HmlSaveState>;
  exportHwpVerify(): Promise<unknown>;
  notifySaved(fileName?: string): Promise<EmbedNotifySavedResult>;
  getPendingAssignment(): Promise<unknown>;
  applyPendingAssignment(assigneeId: string, assigneeName: string, fieldBaseName: string): Promise<unknown>;
  cancelPendingAssignment(): Promise<{ ok: true }>;
  setEditMode(mode: 'normal' | 'form'): Promise<{ mode: 'normal' | 'form' }>;
  setEditableFieldSourceNames(sourceNames: string[]): Promise<{ sourceNames: string[] }>;
  scrollToFirstEditableField(): Promise<{ ok: true }>;
  getFieldValueBySourceName(sourceName: string): Promise<{ sourceName: string; fieldId: number; value: string }>;
  setFieldValueBySourceName(sourceName: string, value: string): Promise<{ sourceName: string; fieldId: number; oldValue: string; newValue: string }>;
  listFields(): Promise<Array<{ sourceName: string; fieldId: number; value: string }>>;
}

export interface EmbedRendererDiagnosticsV1 {
  schemaVersion: 1;
  request: EmbedRendererRuntimeRequestV1 | null;
  initialized: boolean;
  initializationError: string | null;
  effectiveBackend: 'canvas2d' | 'canvaskit' | null;
  backendFallbackReason: string | null;
  selection: unknown;
  page: { index: number; canvaskit: unknown };
}

export interface EmbedRendererRuntimeRequestV1 {
  backend: Omit<RenderBackendRequest, 'backend'> & { backend: RenderBackend };
  canvaskitMode: CanvasKitRenderModeRequest;
  canvaskitSurface: CanvasKitSurfaceRequest;
  renderProfile: LayerRenderProfile;
}

function asParams(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

function asBytes(value: unknown, allowLegacyArray: boolean): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (allowLegacyArray && Array.isArray(value)) return new Uint8Array(value);
  throw new Error('loadFile requires binary data');
}

export async function routeEmbedRequest(
  method: string,
  rawParams: unknown,
  handlers: EmbedRpcHandlers,
  allowLegacyArray = false,
): Promise<unknown> {
  const params = asParams(rawParams);
  switch (method) {
    case 'ready': return handlers.ready();
    case 'loadFile':
      return handlers.loadFile(
        asBytes(params.data, allowLegacyArray),
        typeof params.fileName === 'string' ? params.fileName : 'document.hwp',
        params.skipUnsavedGuard === true,
        params.suppressDialogs === true,
      );
    case 'pageCount': return handlers.pageCount();
    case 'getRendererDiagnostics': {
      const page = params.page ?? 0;
      if (!Number.isSafeInteger(page) || (page as number) < 0) {
        throw new Error('page must be a non-negative safe integer');
      }
      return handlers.getRendererDiagnostics(page as number);
    }
    case 'getPageSvg': return handlers.getPageSvg(
      typeof params.page === 'number' ? params.page : 0,
    );
    case 'exportHwp': return handlers.exportHwp();
    case 'exportHwpx': return handlers.exportHwpx();
    case 'exportHml': return handlers.exportHml();
    case 'getHmlSaveState': return handlers.getHmlSaveState();
    case 'exportHwpVerify': return handlers.exportHwpVerify();
    case 'notifySaved': return handlers.notifySaved(
      typeof params.fileName === 'string' && params.fileName.length > 0
        ? params.fileName
        : undefined,
    );
    case 'getPendingAssignment': return handlers.getPendingAssignment();
    case 'applyPendingAssignment': {
      if (typeof params.assigneeId !== 'string' || typeof params.assigneeName !== 'string' || typeof params.fieldBaseName !== 'string') {
        throw new Error('담당자 배정 정보가 올바르지 않습니다.');
      }
      return handlers.applyPendingAssignment(params.assigneeId, params.assigneeName, params.fieldBaseName);
    }
    case 'cancelPendingAssignment': return handlers.cancelPendingAssignment();
    case 'setEditMode': {
      if (params.mode !== 'normal' && params.mode !== 'form') throw new Error('mode must be normal or form');
      return handlers.setEditMode(params.mode);
    }
    case 'scrollToFirstEditableField':
      return handlers.scrollToFirstEditableField();
    case 'setEditableFieldSourceNames': {
      if (!Array.isArray(params.sourceNames) || !params.sourceNames.every(name => typeof name === 'string')) {
        throw new Error('sourceNames must be an array of strings');
      }
      return handlers.setEditableFieldSourceNames(params.sourceNames);
    }
    case 'getFieldValueBySourceName': {
      if (typeof params.sourceName !== 'string') throw new Error('sourceName must be a string');
      return handlers.getFieldValueBySourceName(params.sourceName);
    }
    case 'setFieldValueBySourceName': {
      if (typeof params.sourceName !== 'string' || typeof params.value !== 'string') {
        throw new Error('sourceName and value must be strings');
      }
      return handlers.setFieldValueBySourceName(params.sourceName, params.value);
    }
    case 'listFields': return handlers.listFields();
    default: throw new Error(`Unknown method: ${method}`);
  }
}
