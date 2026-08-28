import { describe, expect, it } from "vitest";
import { assertCollectionOpen,CollectionClosedError,collectionClosed,collectionMode } from "./domain";

describe("collectionClosed", () => {
  it("마감 시각부터 요청을 닫는다", () => {
    const deadline = "2026-08-25T03:00:00.000Z";
    expect(collectionClosed({ deadline }, Date.parse(deadline) - 1)).toBe(false);
    expect(collectionClosed({ deadline }, Date.parse(deadline))).toBe(true);
  });

  it("저장 직전 마감 검사를 오류로 알린다", () => {
    const deadline = "2026-08-25T03:00:00.000Z";
    expect(() => assertCollectionOpen({ deadline }, Date.parse(deadline) - 1)).not.toThrow();
    expect(() => assertCollectionOpen({ deadline }, Date.parse(deadline))).toThrow(CollectionClosedError);
  });
});

describe("collectionMode",()=>{
  it("mode가 없는 기존 요청을 사람별 제출로 읽는다",()=>{expect(collectionMode({})).toBe("individual")});
  it("지정 필드 공동작성 mode를 유지한다",()=>{expect(collectionMode({mode:"shared_fields"})).toBe("shared_fields")});
});
