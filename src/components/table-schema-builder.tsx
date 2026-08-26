"use client";

import { useState } from "react";
import type { TableColumn,TableRow } from "@/lib/domain";

const firstColumns:TableColumn[]=[
  {id:"item",label:"항목",type:"text",required:true,options:[]},
  {id:"content",label:"내용",type:"text",required:false,options:[]},
];

export function TableSchemaBuilder(){
  const [columns,setColumns]=useState(firstColumns);
  const [rows,setRows]=useState<TableRow[]>([{item:"",content:""}]);
  function updateColumn(index:number,patch:Partial<TableColumn>){setColumns(value=>value.map((column,i)=>i===index?{...column,...patch}:column))}
  function addColumn(){const id=`col_${crypto.randomUUID().replaceAll("-","").slice(0,12)}`;setColumns(value=>[...value,{id,label:`새 열 ${value.length+1}`,type:"text",required:false,options:[]}]);setRows(value=>value.map(row=>({...row,[id]:""})))}
  function removeColumn(index:number){if(columns.length===1)return;const id=columns[index].id;setColumns(value=>value.filter((_,i)=>i!==index));setRows(value=>value.map(row=>Object.fromEntries(Object.entries(row).filter(([key])=>key!==id))))}
  function moveColumn(index:number,direction:-1|1){const target=index+direction;if(target<0||target>=columns.length)return;setColumns(value=>{const next=[...value];[next[index],next[target]]=[next[target],next[index]];return next})}
  function updateCell(rowIndex:number,columnId:string,value:string){setRows(current=>current.map((row,index)=>index===rowIndex?{...row,[columnId]:value}:row))}
  function addRow(){setRows(value=>[...value,Object.fromEntries(columns.map(column=>[column.id,""]))])}
  return <div className="field full">
    <label>웹 표 양식</label>
    <p className="help">담당자는 열과 기본 행을 만들 수 있습니다. 제출자는 같은 열 구조에서 필요한 행을 추가합니다.</p>
    <input type="hidden" name="tableColumns" value={JSON.stringify(columns)}/>
    <input type="hidden" name="tableRows" value={JSON.stringify(rows)}/>
    <div className="schema-columns">
      {columns.map((column,index)=><div className="schema-column" key={column.id}>
        <div className="schema-column-head"><strong>열 {index+1}</strong><div className="mini-actions"><button type="button" onClick={()=>moveColumn(index,-1)} disabled={index===0} aria-label="왼쪽으로">←</button><button type="button" onClick={()=>moveColumn(index,1)} disabled={index===columns.length-1} aria-label="오른쪽으로">→</button><button type="button" onClick={()=>removeColumn(index)} disabled={columns.length===1}>삭제</button></div></div>
        <input aria-label={`${index+1}번째 열 제목`} value={column.label} maxLength={50} onChange={event=>updateColumn(index,{label:event.target.value})}/>
        <select aria-label={`${column.label} 입력 형식`} value={column.type} onChange={event=>updateColumn(index,{type:event.target.value as TableColumn["type"]})}><option value="text">글자</option><option value="number">숫자</option><option value="date">날짜</option><option value="select">단일 선택</option></select>
        {column.type==="select"&&(
          <input aria-label={`${column.label} 선택 항목`} value={column.options.join(", ")} placeholder="예: 참석, 불참" onChange={event=>updateColumn(index,{options:event.target.value.split(",").map(value=>value.trim()).filter(Boolean)})}/>
        )}
        <label className="inline-check"><input type="checkbox" checked={column.required} onChange={event=>updateColumn(index,{required:event.target.checked})}/> 필수 입력</label>
      </div>)}
      <button className="btn btn-secondary add-column" type="button" onClick={addColumn}>+ 열 추가</button>
    </div>
    <div className="grid-editor-wrap">
      <table className="grid-editor"><thead><tr><th>기본 행</th>{columns.map(column=><th key={column.id}>{column.label||"제목 없음"}</th>)}<th></th></tr></thead><tbody>{rows.map((row,rowIndex)=><tr key={rowIndex}><td>{rowIndex+1}</td>{columns.map(column=><td key={column.id}><input value={row[column.id]??""} type={column.type==="date"?"date":column.type==="number"?"number":"text"} onChange={event=>updateCell(rowIndex,column.id,event.target.value)} placeholder="비워도 됨"/></td>)}<td><button className="table-delete" type="button" onClick={()=>setRows(value=>value.length===1?value:value.filter((_,index)=>index!==rowIndex))} disabled={rows.length===1}>삭제</button></td></tr>)}</tbody></table>
    </div>
    <button className="btn btn-secondary row-button" type="button" onClick={addRow}>+ 기본 행 추가</button>
  </div>;
}
