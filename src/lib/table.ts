import { z } from "zod";
import type { TableColumn,TableDefinition,TableRow } from "./domain";

const columnSchema=z.object({
  id:z.string().regex(/^[a-zA-Z0-9_-]{1,50}$/),
  label:z.string().trim().min(1,"열 제목을 입력하세요.").max(50),
  type:z.enum(["text","number","date","select"]),
  required:z.boolean(),
  options:z.array(z.string().trim().min(1).max(80)).max(30),
});

const definitionSchema=z.object({
  columns:z.array(columnSchema).min(1,"열을 한 개 이상 만드세요.").max(30,"열은 최대 30개까지 만들 수 있습니다."),
  initialRows:z.array(z.record(z.string(),z.string())).min(1).max(50,"기본 행은 최대 50개까지 만들 수 있습니다."),
});

export function parseTableDefinition(columnsJson:string,rowsJson:string):TableDefinition{
  let rawColumns:unknown,rawRows:unknown;
  try{rawColumns=JSON.parse(columnsJson);rawRows=JSON.parse(rowsJson)}catch{throw new Error("표 양식 정보를 읽을 수 없습니다.")}
  const parsed=definitionSchema.safeParse({columns:rawColumns,initialRows:rawRows});
  if(!parsed.success)throw new Error(parsed.error.issues[0]?.message||"표 양식이 올바르지 않습니다.");
  const ids=parsed.data.columns.map(column=>column.id);
  if(new Set(ids).size!==ids.length)throw new Error("중복된 열이 있습니다.");
  for(const column of parsed.data.columns){if(column.type==="select"&&column.options.length===0)throw new Error(`${column.label} 열의 선택 항목을 입력하세요.`)}
  return {columns:parsed.data.columns,initialRows:normalizeRows(parsed.data.columns,parsed.data.initialRows,{allowBlank:true,maxRows:50})};
}

export function normalizeRows(columns:TableColumn[],input:unknown,options:{allowBlank:boolean;maxRows?:number}):TableRow[]{
  if(!Array.isArray(input))throw new Error("표 데이터 형식이 올바르지 않습니다.");
  const maxRows=options.maxRows??200;
  if(input.length>maxRows)throw new Error(`한 번에 최대 ${maxRows}행까지 입력할 수 있습니다.`);
  const rows=input.map((raw,index)=>{
    if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new Error(`${index+1}행의 형식이 올바르지 않습니다.`);
    const source=raw as Record<string,unknown>,row:TableRow={};
    for(const column of columns){
      const value=source[column.id];
      if(value!==undefined&&typeof value!=="string")throw new Error(`${column.label} 값이 올바르지 않습니다.`);
      row[column.id]=(value??"").trim().slice(0,1000);
    }
    return row;
  });
  const meaningful=rows.filter(row=>columns.some(column=>row[column.id]!==""));
  if(!options.allowBlank&&meaningful.length===0)throw new Error("제출할 내용을 한 행 이상 입력하세요.");
  const validated=options.allowBlank?rows:meaningful;
  validated.forEach((row,index)=>columns.forEach(column=>{
    const value=row[column.id]??"";
    const rowHasValue=columns.some(item=>(row[item.id]??"")!=="");
    if(rowHasValue&&column.required&&!value)throw new Error(`${index+1}행의 ${column.label} 항목을 입력하세요.`);
    if(value&&column.type==="number"&&!Number.isFinite(Number(value)))throw new Error(`${index+1}행의 ${column.label} 항목은 숫자로 입력하세요.`);
    if(value&&column.type==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new Error(`${index+1}행의 ${column.label} 날짜 형식이 올바르지 않습니다.`);
    if(value&&column.type==="select"&&!column.options.includes(value))throw new Error(`${index+1}행의 ${column.label} 선택값이 올바르지 않습니다.`);
  }));
  return validated.length?validated:[emptyRow(columns)];
}

export const emptyRow=(columns:TableColumn[]):TableRow=>Object.fromEntries(columns.map(column=>[column.id,""]));
