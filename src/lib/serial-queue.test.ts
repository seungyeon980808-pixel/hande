import { describe, expect, it } from "vitest";
import { createSerialQueue } from "./serial-queue";

describe("createSerialQueue", () => {
  it("앞선 작업이 실패해도 다음 작업을 계속 실행한다", async () => {
    const run = createSerialQueue();
    const events: string[] = [];

    await expect(run(async () => {
      events.push("실패 작업");
      throw new Error("디스크 쓰기 실패");
    })).rejects.toThrow("디스크 쓰기 실패");

    await run(async () => {
      events.push("복구 작업");
    });

    expect(events).toEqual(["실패 작업", "복구 작업"]);
  });

  it("동시에 들어온 작업을 등록 순서대로 실행한다", async () => {
    const run = createSerialQueue();
    const events: number[] = [];
    const first = run(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      events.push(1);
    });
    const second = run(async () => {
      events.push(2);
    });

    await Promise.all([first, second]);
    expect(events).toEqual([1, 2]);
  });
});
