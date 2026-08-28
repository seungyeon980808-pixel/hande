/**
 * 앱 전체가 쓰는 기준 학년도.
 * 학교 문서는 보통 다음 학년도용을 미리 만들지만, 시연과 실제 사용 시점이
 * 어긋날 수 있어 한곳에서 정해 둔다. 해가 바뀌면 이 값만 고치면 된다.
 */
export const DEFAULT_TARGET_YEAR=2026;

/** 사용자가 넘긴 값이 쓸 만하면 그대로, 아니면 기준 학년도를 쓴다. */
export function resolveTargetYear(value:unknown){
  const year=Number(value);
  return Number.isInteger(year)&&year>2000&&year<2100?year:DEFAULT_TARGET_YEAR;
}
