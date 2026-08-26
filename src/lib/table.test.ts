import { describe,expect,it } from "vitest";
import { normalizeRows,parseTableDefinition } from "./table";

const columns=[{id:"name",label:"항목",type:"text" as const,required:true,options:[]},{id:"count",label:"수량",type:"number" as const,required:false,options:[]}];

describe("표 취합 검증",()=>{
  it("표 정의와 기본 행을 읽는다",()=>expect(parseTableDefinition(JSON.stringify(columns),JSON.stringify([{name:"기본",count:"1"}])).columns).toHaveLength(2));
  it("빈 행은 최종 제출에서 제외한다",()=>expect(normalizeRows(columns,[{name:"",count:""},{name:"용지",count:"2"}],{allowBlank:false})).toEqual([{name:"용지",count:"2"}]));
  it("필수값과 숫자 형식을 검사한다",()=>{
    expect(()=>normalizeRows(columns,[{name:"",count:"2"}],{allowBlank:false})).toThrow("항목");
    expect(()=>normalizeRows(columns,[{name:"용지",count:"둘"}],{allowBlank:false})).toThrow("숫자");
  });
});
