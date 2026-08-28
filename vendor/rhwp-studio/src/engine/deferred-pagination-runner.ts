import type { DeferredPaginationResult } from '@/core/wasm-bridge';

export interface DeferredPaginationClient {
  beginDeferredPagination(fragmentBudget: number): DeferredPaginationResult;
  stepDeferredPagination(fragmentBudget: number): DeferredPaginationResult;
  cancelDeferredPagination(): boolean;
}

type ScheduledTask = ReturnType<typeof setTimeout>;
type ScheduleTask = (callback: () => void, delayMs?: number) => ScheduledTask;
type RunnerState = 'idle' | 'begin-scheduled' | 'stepping';
type ScheduledStartKind = 'initial' | 'restart';

/**
 * #2424 continuation을 한 macrotask당 한 fragment budget씩 전진시킨다.
 * 입력은 `requestStart()`로 최신 revision 하나만 남긴다. 최초 admission은 입력 프레임을 위한
 * 고정 target delay 뒤에 한 번 확인하고, 이미 전진 중이거나 restart debounce 중인 job은 지정한
 * window까지 합친다.
 */
export class DeferredPaginationRunner {
  private scheduled: ScheduledTask | null = null;
  private state: RunnerState = 'idle';
  private scheduledStartKind: ScheduledStartKind | null = null;
  private postFirstStepDelayMs = 0;
  private generation = 0;

  constructor(
    private readonly client: DeferredPaginationClient,
    private readonly onComplete: (result: DeferredPaginationResult) => void,
    private readonly onFallback: (result: DeferredPaginationResult) => void,
    private readonly fragmentBudget = 1,
    private readonly scheduleTask: ScheduleTask = (callback, delayMs = 0) =>
      setTimeout(callback, delayMs),
    private readonly cancelTask: (task: ScheduledTask) => void = (task) => clearTimeout(task),
  ) {}

  isActive(): boolean {
    return this.state === 'stepping';
  }

  hasPendingWork(): boolean {
    return this.state !== 'idle';
  }

  /**
   * 기존 continuation을 폐기하고 최신 descriptor의 begin을 input stack 밖에 예약한다.
   *
   * 아직 admission을 확인하지 않은 최초 begin은 `initialDelayMs`의 고정 timer target을 유지한다.
   * 그 전에 들어온 요청은 timer를 다시 시작하지 않고 begin 시점의 최신 descriptor를 사용한다.
   * 성공해 전진 중인 job 또는 이미 debounce 중인 restart만 `restartDelayMs`를 다시 적용한다.
   */
  requestStart(restartDelayMs: number, initialDelayMs = 0, postFirstStepDelayMs = 0): void {
    const normalizedRestartDelayMs = Math.max(0, restartDelayMs);
    const normalizedInitialDelayMs = Math.max(0, initialDelayMs);
    const normalizedPostFirstStepDelayMs = Math.max(0, postFirstStepDelayMs);

    // 최초 admission timer는 반복 입력으로 추가 지연되지 않는다. begin callback이 WASM의 최신
    // pending descriptor를 읽으므로 예약을 교체하지 않아도 latest revision 계약을 지킨다.
    if (this.state === 'begin-scheduled' && this.scheduledStartKind === 'initial') return;

    const isRestart = this.state === 'stepping'
      || (this.state === 'begin-scheduled' && this.scheduledStartKind === 'restart');
    const delayMs = isRestart ? normalizedRestartDelayMs : normalizedInitialDelayMs;
    const startKind: ScheduledStartKind = isRestart ? 'restart' : 'initial';

    const generation = ++this.generation;
    this.cancelScheduledTask();
    this.client.cancelDeferredPagination();
    this.state = 'begin-scheduled';
    this.scheduledStartKind = startKind;
    this.postFirstStepDelayMs = normalizedPostFirstStepDelayMs;
    this.scheduled = this.scheduleTask(() => {
      if (!this.isCurrent(generation, 'begin-scheduled')) return;
      this.scheduled = null;
      this.scheduledStartKind = null;
      try {
        this.accept(this.client.beginDeferredPagination(this.fragmentBudget), generation, true);
      } catch {
        this.fail(generation);
      }
    }, delayMs);
  }

  cancel(): void {
    ++this.generation;
    this.cancelScheduledTask();
    if (this.state === 'stepping') {
      this.client.cancelDeferredPagination();
    }
    this.state = 'idle';
    this.scheduledStartKind = null;
    this.postFirstStepDelayMs = 0;
  }

  private accept(
    result: DeferredPaginationResult,
    generation: number,
    isBegin = false,
  ): void {
    if (generation !== this.generation) return;
    if (result.status === 'pending') {
      this.state = 'stepping';
      const delayMs = isBegin ? 0 : this.postFirstStepDelayMs;
      if (!isBegin) this.postFirstStepDelayMs = 0;
      this.scheduleNextStep(generation, delayMs);
      return;
    }
    this.state = 'idle';
    this.postFirstStepDelayMs = 0;
    if (result.status === 'complete') {
      this.onComplete(result);
      return;
    }
    this.onFallback(result);
  }

  private scheduleNextStep(generation: number, delayMs = 0): void {
    if (!this.isCurrent(generation, 'stepping') || this.scheduled !== null) return;
    this.scheduled = this.scheduleTask(() => {
      if (!this.isCurrent(generation, 'stepping')) return;
      this.scheduled = null;
      try {
        this.accept(this.client.stepDeferredPagination(this.fragmentBudget), generation);
      } catch {
        this.fail(generation);
      }
    }, delayMs);
  }

  private fail(generation: number): void {
    if (generation !== this.generation) return;
    this.state = 'idle';
    this.scheduledStartKind = null;
    this.postFirstStepDelayMs = 0;
    this.onFallback({
      ok: false,
      status: 'fallback',
      revision: 0,
      fragmentsProcessed: 0,
      pageCount: 0,
    });
  }

  private isCurrent(generation: number, state: RunnerState): boolean {
    return generation === this.generation && this.state === state;
  }

  private cancelScheduledTask(): void {
    if (this.scheduled === null) return;
    this.cancelTask(this.scheduled);
    this.scheduled = null;
  }
}
