import { describe,expect,it } from "vitest";
import { strFromU8,strToU8,unzipSync,zipSync } from "fflate";
import { personalizeHwpx } from "./hwpx";
describe("HWPX personalization",()=>{it("replaces supported placeholders only in XML entries",()=>{const source=zipSync({"Contents/section0.xml":strToU8("<p>{{교사명}} / {{부서명}}</p>"),"BinData/image.bin":new Uint8Array([1,2,3])});const result=unzipSync(personalizeHwpx(source,"김민정","교무기획부"));expect(strFromU8(result["Contents/section0.xml"])).toBe("<p>김민정 / 교무기획부</p>");expect([...result["BinData/image.bin"]]).toEqual([1,2,3])})});
