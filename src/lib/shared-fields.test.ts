import { readFileSync } from "node:fs";
import path from "node:path";
import { HwpDocument,initSync } from "@rhwp/core";
import { beforeAll,describe,expect,it } from "vitest";

beforeAll(()=>{initSync({module:readFileSync(path.join(process.cwd(),"node_modules","@rhwp","core","rhwp_bg.wasm"))})});

describe("rHWP named field round-trip",()=>{
  it("loads, changes, exports, and reloads an HWPX field value",()=>{
    const seed=HwpDocument.createEmpty();
    seed.createBlankDocument();
    seed.insertText(0,0,0,"공동작성: ");
    seed.insertClickHereField(0,0,6,"담당 내용을 입력하세요","","field_alpha",true);
    const fixture=seed.exportHwpx();
    seed.free();

    const loaded=new HwpDocument(fixture);
    const fields=JSON.parse(loaded.getFieldList()) as Array<{name:string}>;
    expect(fields.map(field=>field.name)).toContain("field_alpha");
    expect(JSON.parse(loaded.setFieldValueByName("field_alpha","공동작성 값 123"))).toMatchObject({ok:true});
    const exported=loaded.exportHwpx();
    loaded.free();

    const reopened=new HwpDocument(exported);
    expect(JSON.parse(reopened.getFieldValueByName("field_alpha"))).toMatchObject({ok:true,value:"공동작성 값 123"});
    reopened.free();
  });
});
