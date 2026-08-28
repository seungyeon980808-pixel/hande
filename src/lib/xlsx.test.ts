import ExcelJS from "exceljs";
import { describe,expect,it } from "vitest";
import type { Collection } from "./domain";
import { createTableWorkbook } from "./xlsx";

describe("표 취합 엑셀",()=>{
  it("최신 제출의 여러 행과 제출 현황 시트를 만든다",async()=>{
    const item={id:"c",type:"table",title:"연수",description:"",deadline:new Date().toISOString(),shareTokenHash:"s",manageTokenHash:"m",templateStorageKey:"",templateName:"",templateSize:0,createdAt:new Date().toISOString(),table:{columns:[{id:"course",label:"연수명",type:"text",required:true,options:[]}],initialRows:[{course:""}]},recipients:[{id:"t",name:"김교사",department:"교무부",drafts:[],versions:[{id:"v",version:1,kind:"table",storageKey:"",displayName:"표 데이터",size:0,createdAt:"2026-08-24T00:00:00.000Z",rows:[{course:"AI"},{course:"평가"}]}]}]} satisfies Collection;
    const workbook=new ExcelJS.Workbook();
    const bytes=await createTableWorkbook(item);
    await workbook.xlsx.load(bytes as unknown as Parameters<typeof workbook.xlsx.load>[0]);
    expect(workbook.worksheets.map(sheet=>sheet.name)).toEqual(["전체 취합 결과","제출 현황"]);
    const result=workbook.getWorksheet("전체 취합 결과");
    const status=workbook.getWorksheet("제출 현황");
    expect(result?.rowCount).toBe(3);
    expect(result?.getCell("C2").value).toBeInstanceOf(Date);
    expect(result?.getCell("C2").numFmt).toContain("yyyy");
    expect(status?.getCell("E2").value).toBeInstanceOf(Date);
    expect(status?.getCell("E2").numFmt).toContain("yyyy");
    expect(status?.autoFilter).toBeTruthy();
  });
});
