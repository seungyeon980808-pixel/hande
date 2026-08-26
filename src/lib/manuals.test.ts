import { describe,expect,it } from "vitest";
import { filterManuals,manuals } from "./manuals";

describe("manual search",()=>{
  it("finds a manual by a natural task phrase",()=>{expect(filterManuals(manuals,"편집기가 안 열려요","전체").map(item=>item.id)).toContain("rhwp-troubleshoot")});
  it("finds manual text and respects category filters",()=>{expect(filterManuals(manuals,"재제출","문서 취합").length).toBeGreaterThan(0);expect(filterManuals(manuals,"재제출","보안")).toHaveLength(0)});
});
