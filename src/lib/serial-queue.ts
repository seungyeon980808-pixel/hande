export function createSerialQueue() {
  let tail: Promise<void> = Promise.resolve();

  return async function run(task: () => Promise<void>) {
    const current = tail.then(task, task);
    tail = current.catch(() => undefined);
    await current;
  };
}
