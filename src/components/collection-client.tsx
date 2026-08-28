"use client";

import { formatDateTime } from "@/lib/datetime";
import Link from "next/link";
import { useState } from "react";
import type { CollectionType,TableDefinition } from "@/lib/domain";
import { collectionTypeLabel } from "@/lib/domain";
import { RhwpEditor } from "./rhwp-editor";
import { TableEditor } from "./table-editor";
import { FileSubmission } from "./file-submission";
import { DEFAULT_TARGET_YEAR } from "@/lib/school-year";
type Person={id:string;name:string;department:string;versionCount:number};
type Item={type:CollectionType;title:string;description:string;deadline:string;templateName:string;hasReference?:boolean;targetYear?:number;table?:TableDefinition;recipients:Person[]};
type DocMode="editor"|"upload";

function DocumentPanel({token,person,templateName,hasReference,targetYear}:{token:string;person:Person;templateName:string;hasReference:boolean;targetYear:number}){
  const [mode,setMode]=useState<DocMode>("editor");
  return <>
    <div className="card card-pad" style={{marginTop:12,marginBottom:12}}>
      <strong style={{fontSize:15}}>작성 방법을 선택하세요</strong>
      <p className="help" style={{margin:"4px 0 10px"}}>둘 중 편한 방법으로 제출하면 됩니다. 제출 결과는 동일합니다.</p>
      <div className="action-buttons">
        <button className={`btn ${mode==="editor"?"btn-primary":"btn-secondary"}`} onClick={()=>setMode("editor")}>브라우저에서 편집</button>
        <button className={`btn ${mode==="upload"?"btn-primary":"btn-secondary"}`} onClick={()=>setMode("upload")}>한글로 작성해 올리기</button>
      </div>
      <p className="help" style={{margin:"10px 0 0"}}>{mode==="editor"?"한글 프로그램 없이 웹에서 바로 작성합니다.":"양식을 내려받아 한글 프로그램으로 작성한 뒤 파일을 올립니다."}</p>
    </div>
    {mode==="editor"
      ?<RhwpEditor key={`editor-${person.id}`} token={token} person={person} hasReference={hasReference} targetYear={targetYear}/>
      :<FileSubmission key={`upload-${person.id}`} token={token} person={person} templateName={templateName} kind="document"/>}
  </>;
}

export function CollectionClient({token,item}:{token:string;item:Item}){const [query,setQuery]=useState(""),[selected,setSelected]=useState<Person|null>(null);const filtered=item.recipients.filter(person=>(person.name+person.department).includes(query));return <div className="app-shell"><header className="topbar"><Link className="brand" href="/" style={{textDecoration:"none"}}>학교업무 한곳 <small>{collectionTypeLabel(item.type)} 제출</small></Link><Link className="btn btn-secondary" href="/" style={{fontSize:13}}>업무 취합으로</Link></header><main className="content" style={selected&&item.type==="document"?{maxWidth:"none"}:{maxWidth:1060}}><div className="page-head"><div><h1>{item.title}</h1><p className="subtle">{collectionTypeLabel(item.type)} · 마감 {formatDateTime(item.deadline)}</p></div></div>{item.description&&<p className="notice">{item.description}</p>}{!selected?<section className="card card-pad" style={{marginTop:18,maxWidth:620}}><h2 style={{fontSize:18,marginTop:0}}>본인 이름을 선택해 주세요</h2><p className="subtle">로그인 대신 이름과 부서를 함께 확인합니다. 다른 사람의 이름을 선택하지 마세요.</p><div className="field" style={{marginTop:18}}><label htmlFor="teacher-search">이름 또는 부서 검색</label><input id="teacher-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="예: 김민정 또는 교무기획부"/></div><div style={{display:"grid",gap:8,marginTop:12}}>{filtered.map(person=><button key={person.id} className="teacher-check" style={{cursor:"pointer",textAlign:"left"}} onClick={()=>setSelected(person)}><span style={{flex:1}}><strong>{person.name}</strong> · {person.department}</span>{person.versionCount>0&&<span className="badge badge-open">제출 {person.versionCount}회</span>}</button>)}</div></section>:<section style={{marginTop:18}}><div className="card card-pad selected-person"><div><strong>{selected.name}</strong> · {selected.department}<p className="help" style={{margin:"5px 0 0"}}>{item.type==="table"?"웹 표에 바로 입력합니다.":`양식: ${item.templateName}`} · 재제출해도 기존 버전은 삭제되지 않습니다.</p></div><button className="btn btn-secondary" onClick={()=>setSelected(null)}>다시 선택</button></div>{item.type==="document"?<DocumentPanel key={selected.id} token={token} person={selected} templateName={item.templateName} hasReference={Boolean(item.hasReference)} targetYear={item.targetYear??DEFAULT_TARGET_YEAR}/>:item.type==="table"&&item.table?<TableEditor key={selected.id} token={token} person={selected} columns={item.table.columns} initialRows={item.table.initialRows}/>:<FileSubmission key={selected.id} token={token} person={selected} templateName={item.templateName} kind="xlsx"/>}</section>}</main></div>}
