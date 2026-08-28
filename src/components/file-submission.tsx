"use client";

import { formatDateTime } from "@/lib/datetime";

import { useCallback,useEffect,useRef,useState } from "react";
import { FileDrop } from "./file-drop";

type Person={id:string;name:string;department:string};
type Kind="xlsx"|"document";

const PRESET={
  xlsx:{accept:".xlsx",label:"XLSX",app:"Excel",draftExt:"xlsx",storageTag:"xlsx"},
  document:{accept:".hwp,.hwpx",label:"HWP/HWPX",app:"한글",draftExt:"hwpx",storageTag:"doc"},
} as const;

export function FileSubmission({token,person,templateName,kind}:{token:string;person:Person;templateName:string;kind:Kind}){
  const preset=PRESET[kind];
  const [file,setFile]=useState<File|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[status,setStatus]=useState("서버 임시본 확인 중..."),[draftUrl,setDraftUrl]=useState(""),[draftName,setDraftName]=useState("");
  const draftKey=useRef(""),draftObjectUrl=useRef("");
  const showDraft=useCallback((blob:Blob,name:string)=>{if(draftObjectUrl.current)URL.revokeObjectURL(draftObjectUrl.current);draftObjectUrl.current=URL.createObjectURL(blob);setDraftUrl(draftObjectUrl.current);setDraftName(name)},[]);
  const clearDraft=useCallback(()=>{if(draftObjectUrl.current)URL.revokeObjectURL(draftObjectUrl.current);draftObjectUrl.current="";setDraftUrl("");setDraftName("")},[]);
  useEffect(()=>{let active=true;const keyName=`school-work-${preset.storageTag}-draft:${token}:${person.id}`;let key=localStorage.getItem(keyName);if(!key){key=crypto.randomUUID();localStorage.setItem(keyName,key)}draftKey.current=key;(async()=>{try{const response=await fetch(`/api/collect/${token}/draft?teacherId=${encodeURIComponent(person.id)}&draftKey=${encodeURIComponent(key)}`);if(response.status===204){if(active)setStatus("저장된 임시 파일이 없습니다.");return}if(!response.ok)throw new Error((await response.json()).error);const blob=await response.blob();if(active){showDraft(blob,decodeURIComponent(response.headers.get("X-Document-Name")||`임시저장.${preset.draftExt}`));setStatus(`임시 파일이 저장되어 있습니다${response.headers.get("X-Draft-Updated-At")?` · ${formatDateTime(response.headers.get("X-Draft-Updated-At")!)}`:""}`)}}catch(cause){if(active)setError(cause instanceof Error?cause.message:"임시 파일을 확인하지 못했습니다.")}})();return()=>{active=false;if(draftObjectUrl.current)URL.revokeObjectURL(draftObjectUrl.current);draftObjectUrl.current=""}},[person.id,preset.draftExt,preset.storageTag,showDraft,token]);
  async function upload(mode:"draft"|"submit"){
    if(!file){setError(`작성한 ${preset.label} 파일을 선택하세요.`);return}
    setBusy(true);setError("");
    try{const selectedFile=file;const form=new FormData();form.set("teacherId",person.id);form.set("draftKey",draftKey.current);form.set("document",selectedFile);const response=await fetch(`/api/collect/${token}/${mode==="draft"?"draft":"submissions"}`,{method:"POST",body:form});const body=await response.json();if(!response.ok)throw new Error(body.error);if(mode==="draft"){showDraft(selectedFile,selectedFile.name);setStatus(`임시 업로드 완료 · ${formatDateTime(body.updatedAt)}`)}else{setStatus(`${body.version}차 최종 제출 완료 · 기존 제출은 그대로 보관됩니다.`);clearDraft()}setFile(null)}catch(cause){setError(cause instanceof Error?cause.message:"파일을 올리지 못했습니다.")}finally{setBusy(false)}
  }
  return <div className="card card-pad xlsx-panel">
    <div className="xlsx-step"><span>1</span><div><strong>양식 내려받기</strong><p>담당자가 올린 원본 양식을 {preset.app}에서 작성하세요.</p><a className="btn btn-secondary" href={`/api/collect/${token}/template?teacherId=${encodeURIComponent(person.id)}`}>{templateName} 다운로드</a></div></div>
    <div className="xlsx-step"><span>2</span><div><strong>작성 파일 선택</strong><p>작성한 {preset.label} 파일을 선택하세요. 최대 20MB까지 가능합니다.</p><FileDrop accept={preset.accept} hint={preset.label} file={file} onPick={setFile}/></div></div>
    <div className="xlsx-step"><span>3</span><div><strong>임시 또는 최종 제출</strong><p>작성 중이면 임시 업로드, 완료했으면 최종 제출을 누르세요.</p><div className="action-buttons"><button className="btn btn-secondary" disabled={busy} onClick={()=>void upload("draft")}>임시 업로드</button><button className="btn btn-primary" disabled={busy} onClick={()=>void upload("submit")}>{busy?"처리 중...":"최종 제출"}</button></div></div></div>
    {draftUrl&&<div className="notice"><strong>서버 임시 파일</strong> · <a href={draftUrl} download={draftName} style={{color:"var(--navy)",fontWeight:700}}>이어 작성할 파일 다운로드</a></div>}
    <p className="subtle">{status}</p>
    {error&&<div className="error">{error}</div>}
  </div>;
}
