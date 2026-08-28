"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import type { RhwpEditor } from "@rhwp/editor";
import { getRhwpStudioUrl } from "@/lib/rhwp-studio-url";

type Person={id:string;name:string;department:string};
type Field={id:string;sourceName:string;label:string;required:boolean;order:number;status:"unstarted"|"drafting"|"shared"|"submitted";value:string;draftUpdatedAt:string|null;versionCount:number};
type FormEditor=RhwpEditor&{_request:(method:string,params?:Record<string,unknown>)=>Promise<unknown>};
type SaveAction="draft"|"shared"|"submitted";

export function SharedFieldsEditor({token,person}:{token:string;person:Person}){
  const host=useRef<HTMLDivElement>(null),editor=useRef<FormEditor|null>(null),draftKey=useRef(""),fieldRef=useRef<Field[]>([]),lastValues=useRef<Record<string,string>>({}),saving=useRef(false);
  const [fields,setFields]=useState<Field[]>([]),[ready,setReady]=useState(false),[busy,setBusy]=useState(""),[error,setError]=useState(""),[message,setMessage]=useState("문서를 준비하고 있습니다.");

  const fetchFields=useCallback(async()=>{const response=await fetch(`/api/collect/${token}/shared-fields?teacherId=${encodeURIComponent(person.id)}&draftKey=${encodeURIComponent(draftKey.current)}`,{cache:"no-store"}),body=await response.json();if(!response.ok)throw new Error(body.error);const next=body.fields as Field[];fieldRef.current=next;setFields(next);return next},[person.id,token]);
  const readValues=useCallback(async()=>{if(!editor.current)return[];return Promise.all(fieldRef.current.map(async field=>{const result=await editor.current!._request("getFieldValueBySourceName",{sourceName:field.sourceName}) as {value?:string};return {fieldId:field.id,value:result.value??""}}))},[]);

  useEffect(()=>{let active=true,instance:FormEditor|null=null;(async()=>{try{
    const storageKey=`school-work-shared-field:${token}:${person.id}`;let key=localStorage.getItem(storageKey);if(!key){key=crypto.randomUUID();localStorage.setItem(storageKey,key)}draftKey.current=key;
    const next=await fetchFields();if(!host.current||!active)return;const {createEditor}=await import("@rhwp/editor");instance=await createEditor(host.current,{height:"720px",studioUrl:getRhwpStudioUrl()}) as FormEditor;editor.current=instance;
    const preview=await fetch(`/api/collect/${token}/shared-preview`,{cache:"no-store"});if(!preview.ok)throw new Error((await preview.json()).error);const name=decodeURIComponent(preview.headers.get("X-Document-Name")||"공동문서.hwpx");await instance.loadFile(await preview.arrayBuffer(),name,{skipUnsavedGuard:true,suppressDialogs:true});
    await instance._request("setEditableFieldSourceNames",{sourceNames:next.map(field=>field.sourceName)});await instance._request("setEditMode",{mode:"form"});
    for(const field of next)await instance._request("setFieldValueBySourceName",{sourceName:field.sourceName,value:field.value});
    if(!active)return;const values=await readValues();lastValues.current=Object.fromEntries(values.map(value=>[value.fieldId,value.value]));setReady(true);setMessage(next.length?"문서에서 표시된 담당 영역을 직접 작성하세요.":"현재 본인에게 지정된 작성 영역이 없습니다.");
  }catch(cause){if(active)setError(cause instanceof Error?cause.message:"공동 문서를 열지 못했습니다.")}})();return()=>{active=false;instance?.destroy();editor.current=null}},[fetchFields,person.id,readValues,token]);

  const save=useCallback(async(action:SaveAction,automatic=false)=>{if(!editor.current||saving.current||fieldRef.current.length===0)return;saving.current=true;if(!automatic)setBusy(action);setError("");try{const current=await readValues(),values=action==="draft"?current.filter(value=>lastValues.current[value.fieldId]!==value.value):current;if(values.length===0){if(!automatic)setMessage("변경된 내용이 없습니다.");return}const response=await fetch(`/api/collect/${token}/shared-fields`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({teacherId:person.id,draftKey:draftKey.current,action,fields:values})}),body=await response.json();if(!response.ok)throw new Error(body.error);for(const value of values)lastValues.current[value.fieldId]=value.value;await fetchFields();setMessage(action==="draft"?`${automatic?"자동 ":""}임시저장했습니다.`:action==="shared"?"현재 작성 내용을 중간 공유했습니다.":"담당 영역을 최종 제출했습니다.")}catch(cause){setError(cause instanceof Error?cause.message:"담당 영역을 저장하지 못했습니다.")}finally{saving.current=false;if(!automatic)setBusy("")}},[fetchFields,person.id,readValues,token]);
  useEffect(()=>{if(!ready)return;const timer=window.setInterval(()=>void save("draft",true),60_000);return()=>window.clearInterval(timer)},[ready,save]);

  return <div className="shared-editor-direct">
    <section className="card card-pad"><div className="shared-editor-heading"><div><h2 className="section-title">양식에서 직접 작성</h2><p className="subtle">내 담당 누름틀만 수정할 수 있습니다. 일반 본문과 다른 사람 영역은 잠겨 있습니다.</p></div><span className="badge badge-type">{fields.length}개 영역</span></div>{error&&<div className="error" style={{marginTop:12}}>{error}</div>}<div ref={host} className="shared-direct-editor"/>{!ready&&!error&&<div className="notice" style={{marginTop:12}}>HWPX 양식을 불러오는 중입니다.</div>}<div className="shared-save-bar"><span className="help">{message}</span><div className="action-buttons"><button type="button" className="btn btn-secondary" disabled={!ready||!!busy||fields.length===0} onClick={()=>void save("draft")}>{busy==="draft"?"저장 중...":"임시저장"}</button><button type="button" className="btn btn-secondary" disabled={!ready||!!busy||fields.length===0} onClick={()=>void save("shared")}>{busy==="shared"?"공유 중...":"중간 공유"}</button><button type="button" className="btn btn-primary" disabled={!ready||!!busy||fields.length===0} onClick={()=>void save("submitted")}>{busy==="submitted"?"제출 중...":"최종 제출"}</button></div></div></section>
    {fields.length>0&&<details className="card card-pad assigned-field-summary"><summary>내 담당 영역 {fields.length}개와 상태</summary><div className="assigned-fields">{fields.map(field=><article className="assigned-field" key={field.id}><div className="assigned-field-head"><strong>{field.label}{field.required&&<span className="required-mark"> *</span>}</strong><span className={`badge ${field.status==="submitted"?"badge-open":field.status==="unstarted"?"badge-draft":"badge-late"}`}>{statusLabel(field.status)}</span></div><span className="help">버전 {field.versionCount}개{field.draftUpdatedAt?` · 임시저장 ${new Date(field.draftUpdatedAt).toLocaleString("ko-KR")}`:""}</span></article>)}</div></details>}
  </div>;
}

function statusLabel(status:Field["status"]){return status==="unstarted"?"미작성":status==="drafting"?"작성 중":status==="shared"?"중간 공유":"제출 완료"}
