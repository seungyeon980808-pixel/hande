"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import type { TableColumn,TableRow } from "@/lib/domain";

type Person={id:string;name:string;department:string};

export function TableEditor({token,person,columns,initialRows}:{token:string;person:Person;columns:TableColumn[];initialRows:TableRow[]}){
  const [rows,setRows]=useState<TableRow[]>(initialRows),[status,setStatus]=useState("임시저장 확인 중..."),[error,setError]=useState(""),[busy,setBusy]=useState(false),[done,setDone]=useState(false);
  const rowsRef=useRef(rows),draftKey=useRef(""),saving=useRef(false),dirty=useRef(false),editRevision=useRef(0);
  useEffect(()=>{rowsRef.current=rows},[rows]);
  const changeRows=(next:TableRow[])=>{editRevision.current+=1;dirty.current=true;setDone(false);setRows(next)};
  const saveDraft=useCallback(async(manual:boolean)=>{
    if(!draftKey.current||saving.current||(!manual&&!dirty.current))return;
    saving.current=true;setError("");setStatus(manual?"임시저장 중...":"자동 임시저장 중...");
    try{const response=await fetch(`/api/collect/${token}/table-draft`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({teacherId:person.id,draftKey:draftKey.current,rows:rowsRef.current})});const body=await response.json();if(!response.ok)throw new Error(body.error);dirty.current=false;setStatus(`${manual?"임시저장":"자동저장"} 완료 · ${new Date(body.updatedAt).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})}`)}catch(cause){setError(cause instanceof Error?cause.message:"임시저장하지 못했습니다.");setStatus("임시저장 실패")}finally{saving.current=false}
  },[person.id,token]);
  useEffect(()=>{let active=true;const recoveryRevision=editRevision.current;const keyName=`school-work-table-draft:${token}:${person.id}`;let key=localStorage.getItem(keyName);if(!key){key=crypto.randomUUID();localStorage.setItem(keyName,key)}draftKey.current=key;(async()=>{try{const response=await fetch(`/api/collect/${token}/table-draft?teacherId=${encodeURIComponent(person.id)}&draftKey=${encodeURIComponent(key)}`);if(response.status===204){if(active)setStatus("작성 내용은 1분마다 서버에 자동 임시저장됩니다.");return}const body=await response.json();if(!response.ok)throw new Error(body.error);if(active){if(editRevision.current!==recoveryRevision){setStatus("현재 작성 중인 내용을 유지했습니다. 임시저장 내용을 불러오지 않았습니다.")}else{setRows(body.rows);setStatus(`임시저장 표를 복구했습니다 · ${new Date(body.updatedAt).toLocaleString("ko-KR")}`)}}}catch(cause){if(active)setError(cause instanceof Error?cause.message:"임시저장 표를 불러오지 못했습니다.")}})();const timer=window.setInterval(()=>void saveDraft(false),60_000);return()=>{active=false;window.clearInterval(timer)}},[person.id,saveDraft,token]);
  function updateCell(rowIndex:number,columnId:string,value:string){changeRows(rows.map((row,index)=>index===rowIndex?{...row,[columnId]:value}:row))}
  function addRow(){changeRows([...rows,Object.fromEntries(columns.map(column=>[column.id,""]))])}
  function deleteRow(index:number){if(rows.length===1)return;changeRows(rows.filter((_,rowIndex)=>rowIndex!==index))}
  async function submit(){setBusy(true);setError("");try{const response=await fetch(`/api/collect/${token}/table-submissions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({teacherId:person.id,draftKey:draftKey.current,rows})});const body=await response.json();if(!response.ok)throw new Error(body.error);dirty.current=false;setDone(true);setStatus(`${body.version}차 제출 완료 · 기존 제출은 그대로 보관됩니다.`)}catch(cause){setError(cause instanceof Error?cause.message:"제출하지 못했습니다.")}finally{setBusy(false)}}
  return <div className="card card-pad">
    {error&&<div className="error" style={{marginBottom:12}}>{error}</div>}
    {done&&<div className="success" style={{marginBottom:12}}>표 데이터가 제출되었습니다. 다시 수정해 제출하면 새 버전으로 보관됩니다.</div>}
    <div className="grid-editor-wrap"><table className="grid-editor entry-grid"><thead><tr><th>행</th>{columns.map(column=><th key={column.id}>{column.label}{column.required&&<span className="required-mark"> *</span>}</th>)}<th></th></tr></thead><tbody>{rows.map((row,rowIndex)=><tr key={rowIndex}><td>{rowIndex+1}</td>{columns.map(column=><td key={column.id}>{column.type==="select"?<select value={row[column.id]??""} onChange={event=>updateCell(rowIndex,column.id,event.target.value)} required={column.required}><option value="">선택</option>{column.options.map(option=><option key={option}>{option}</option>)}</select>:<input value={row[column.id]??""} onChange={event=>updateCell(rowIndex,column.id,event.target.value)} required={column.required} type={column.type==="date"?"date":column.type==="number"?"number":"text"}/>}</td>)}<td><button className="table-delete" type="button" disabled={rows.length===1} onClick={()=>deleteRow(rowIndex)}>삭제</button></td></tr>)}</tbody></table></div>
    <button className="btn btn-secondary row-button" type="button" onClick={addRow}>+ 입력 행 추가</button>
    <div className="editor-actions"><span className="subtle">{status}</span><div className="action-buttons"><button className="btn btn-secondary" disabled={busy} onClick={()=>void saveDraft(true)}>임시저장</button><button className="btn btn-primary" disabled={busy} onClick={submit}>{busy?"제출 중...":"표 데이터 제출"}</button></div></div>
  </div>;
}
