import { describe,expect,it } from "vitest";
import { NeisResponseError,parseNeisTimetable } from "./neis-data";

describe("NEIS timetable parser",()=>{
  it("normalizes and sorts timetable rows",()=>{
    const result=parseNeisTimetable({misTimetable:[{head:[{RESULT:{CODE:"INFO-000",MESSAGE:"정상 처리되었습니다."}}]},{row:[
      {ATPT_OFCDC_SC_NM:"샘플교육청",SCHUL_NM:"샘플중학교",AY:"2026",SEM:"2",ALL_TI_YMD:"20260826",GRADE:"1",CLASS_NM:"1",PERIO:"2",ITRT_CNTNT:"수학",LOAD_DTM:"20260826"},
      {ATPT_OFCDC_SC_NM:"샘플교육청",SCHUL_NM:"샘플중학교",AY:"2026",SEM:"2",ALL_TI_YMD:"20260826",GRADE:"1",CLASS_NM:"1",PERIO:"1",ITRT_CNTNT:"국어",LOAD_DTM:"20260826"},
    ]}]});
    expect(result.schoolName).toBe("샘플중학교");
    expect(result.entries.map(entry=>[entry.date,entry.period,entry.subject])).toEqual([["2026-08-26",1,"국어"],["2026-08-26",2,"수학"]]);
    expect(result.loadedAt).toBe("20260826");
  });
  it("treats INFO-200 as an empty timetable",()=>expect(parseNeisTimetable({RESULT:{CODE:"INFO-200",MESSAGE:"해당하는 데이터가 없습니다."}}).entries).toEqual([]));
  it("preserves upstream error codes",()=>expect(()=>parseNeisTimetable({RESULT:{CODE:"ERROR-290",MESSAGE:"인증키가 유효하지 않습니다."}})).toThrowError(NeisResponseError));
});
