import { describe,expect,it } from "vitest";
import { defaultTools,filterTools,normalizeToolUrl,parseStoredTools } from "./toolbox";

describe("toolbox",()=>{
  it("adds https to a plain host",()=>expect(normalizeToolUrl("example.com/path")).toBe("https://example.com/path"));
  it("filters tools by keyword and category",()=>{
    expect(filterTools(defaultTools,"수업","수업").map(tool=>tool.id)).toEqual(["classroom","ebs"]);
    expect(filterTools(defaultTools,"canva","전체").map(tool=>tool.id)).toEqual(["canva"]);
  });
  it("falls back when saved data is invalid",()=>expect(parseStoredTools('{"bad":true}')).toEqual(defaultTools));
});
