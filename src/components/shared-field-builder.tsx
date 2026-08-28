"use client";

import { useEffect,useRef,useState } from "react";
import type { RhwpEditor } from "@rhwp/editor";
import type { SharedFieldInitialContentMode,Teacher } from "@/lib/domain";
import { getRhwpStudioUrl } from "@/lib/rhwp-studio-url";

type InspectedField={sourceName:string;label:string;initialValue:string;fieldType:string};
type FieldSetting=InspectedField&{assigneeId:string;required:boolean;initialContentMode:SharedFieldInitialContentMode};
type AssignmentSelection={id:number;kind:"caret"|"text"|"cells";summary:string};
type AssignmentEditor=RhwpEditor&{_request:(method:string,params?:Record<string,unknown>)=>Promise<unknown>};

function assignedTeacherId(sourceName:string){const match=/^assigned__(.*?)__/.exec(sourceName);return match?decodeURIComponent(match[1]):""}

export function SharedFieldBuilder({teachers}:{teachers:Teacher[]}){
  const inputRef=useRef<HTMLInputElement>(null),hostRef=useRef<HTMLDivElement>(null),editorRef=useRef<RhwpEditor|null>(null),fileNameRef=useRef("template.hwpx");
  const [fields,setFields]=useState<FieldSetting[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[uploaded,setUploaded]=useState(false),[editorReady,setEditorReady]=useState(false),[status,setStatus]=useState(""),[pending,setPending]=useState<AssignmentSelection|null>(null);

  useEffect(()=>()=>{editorRef.current?.destroy();editorRef.current=null},[]);
  useEffect(()=>{
    if(!editorReady)return;
    let active=true,running=false;
    const poll=async()=>{if(running||!editorRef.current)return;running=true;try{const next=await (editorRef.current as AssignmentEditor)._request("getPendingAssignment") as AssignmentSelection|null;if(active)setPending(next)}catch{/* 구버전 Studio에서는 패널만 비활성 */}finally{running=false}};
    void poll();const timer=window.setInterval(()=>void poll(),250);
    return()=>{active=false;window.clearInterval(timer)};
  },[editorReady]);

  async function readFields(file:File,preserve=false){
    const form=new FormData();form.set("template",file);
    const response=await fetch("/api/shared-fields/inspect",{method:"POST",body:form}),body=await response.json();
    if(!response.ok)throw new Error(body.error);
    const inspected=body.fields as InspectedField[];
    setFields(current=>inspected.map(field=>{const previous=preserve?current.find(item=>item.sourceName===field.sourceName):undefined,autoId=assignedTeacherId(field.sourceName),validAuto=teachers.some(teacher=>teacher.id===autoId)?autoId:"";return previous?{...field,assigneeId:previous.assigneeId||validAuto,required:previous.required,initialContentMode:previous.initialContentMode}:{...field,assigneeId:validAuto,required:false,initialContentMode:"template"}}));
    return inspected.length;
  }

  function setInputFile(file:File){if(!inputRef.current)return;const transfer=new DataTransfer();transfer.items.add(file);inputRef.current.files=transfer.files}
  async function syncEditorFile(){if(!editorRef.current)throw new Error("편집기가 준비되지 않았습니다.");const bytes=await editorRef.current.exportHwpx();const file=new File([new Uint8Array(bytes).buffer],fileNameRef.current.replace(/\.hwp$/i,".hwpx"),{type:"application/vnd.hancom.hwpx"});setInputFile(file);await readFields(file,true);return file}

  async function openFile(file:File|undefined){
    setFields([]);setError("");setStatus("");setUploaded(Boolean(file));setEditorReady(false);setPending(null);
    if(!file)return;fileNameRef.current=file.name;setBusy(true);
    try{const existing=await readFields(file);const {createEditor}=await import("@rhwp/editor");if(!hostRef.current)return;if(!editorRef.current)editorRef.current=await createEditor(hostRef.current,{height:"620px",studioUrl:getRhwpStudioUrl()});await editorRef.current.loadFile(await file.arrayBuffer(),file.name,{skipUnsavedGuard:true,suppressDialogs:true});setEditorReady(true);setStatus(existing?`기존 작성 영역 ${existing}개를 찾았습니다.`:"문서에서 커서 또는 셀 범위를 선택한 뒤 /를 누르세요.")}
    catch(cause){setError(cause instanceof Error?cause.message:"문서를 열지 못했습니다.")}finally{setBusy(false)}
  }

  async function assign(teacher:Teacher){
    if(!editorRef.current||!pending)return;setBusy(true);setError("");
    try{const fieldBaseName=`assigned__${encodeURIComponent(teacher.id)}__${crypto.randomUUID().replaceAll("-","")}`;const result=await (editorRef.current as AssignmentEditor)._request("applyPendingAssignment",{assigneeId:teacher.id,assigneeName:teacher.name,fieldBaseName}) as {count?:number};const file=await syncEditorFile();await editorRef.current.loadFile(await file.arrayBuffer(),file.name,{skipUnsavedGuard:true,suppressDialogs:true});setPending(null);setStatus(`${pending.summary}를 ${teacher.name} 선생님에게 배정했습니다${result.count?` · 작성 영역 ${result.count}개`:""}.`)}
    catch(cause){setError(cause instanceof Error?cause.message:"담당자를 배정하지 못했습니다.")}finally{setBusy(false)}
  }
  async function cancelAssignment(){if(editorRef.current)await (editorRef.current as AssignmentEditor)._request("cancelPendingAssignment").catch(()=>{});setPending(null);setStatus("배정을 취소했습니다.")}

  async function applyMarkers(){
    if(!editorRef.current)return;setBusy(true);setError("");
    try{const bytes=await editorRef.current.exportHwpx(),edited=new File([new Uint8Array(bytes).buffer],fileNameRef.current.replace(/\.hwp$/i,".hwpx"),{type:"application/vnd.hancom.hwpx"}),form=new FormData();form.set("template",edited);const response=await fetch("/api/shared-fields/materialize",{method:"POST",body:form});if(!response.ok)throw new Error((await response.json()).error);const converted=Number(response.headers.get("X-Converted-Fields")||0),file=new File([await response.arrayBuffer()],edited.name,{type:"application/vnd.hancom.hwpx"});setInputFile(file);await readFields(file,true);if(converted)await editorRef.current.loadFile(await file.arrayBuffer(),file.name,{skipUnsavedGuard:true,suppressDialogs:true});setStatus(`고급 표식 ${converted}개를 작성 영역으로 변환했습니다.`)}catch(cause){setError(cause instanceof Error?cause.message:"표식을 적용하지 못했습니다.")}finally{setBusy(false)}
  }

  function update(index:number,patch:Partial<FieldSetting>){setFields(current=>current.map((field,fieldIndex)=>fieldIndex===index?{...field,...patch}:field))}
  function move(index:number,delta:number){setFields(current=>{const target=index+delta;if(target<0||target>=current.length)return current;const next=[...current];[next[index],next[target]]=[next[target],next[index]];return next})}

  return <div className="field full shared-field-builder">
    <div className="builder-title"><div><label htmlFor="template">HWPX 양식과 작성 영역</label><span className="help">제출 대상을 먼저 선택한 뒤 양식을 올리세요.</span></div>{uploaded&&<span className="step-badge">업로드 완료</span>}</div>
    <input ref={inputRef} id="template" name="template" required type="file" accept=".hwpx" onChange={event=>void openFile(event.target.files?.[0])}/>
    {busy&&<div className="notice">문서와 작성 영역을 반영하는 중입니다.</div>}{error&&<div className="error">{error}</div>}
    {uploaded&&<div className="template-field-workspace"><div className="workspace-guide"><strong>편집기 안에서 바로 배정</strong><ol><li>본문은 작성 위치에 커서를 놓고, 표는 F5와 방향키 또는 드래그로 셀 범위를 선택합니다.</li><li><code>/</code>를 누르면 현재 위치가 배정 대기 상태로 고정됩니다.</li><li>오른쪽에서 담당자 이름을 누릅니다.</li></ol><span className="help">클릭과 드래그만으로는 배정되지 않습니다. 슬래시를 눌렀을 때만 담당자 버튼이 활성화됩니다.</span></div><div className="assignment-workspace"><div ref={hostRef} className="shared-template-editor"/><aside className={`assignment-panel ${pending?"is-active":""}`}><h3>담당자 배정</h3>{teachers.length===0?<div className="assignment-empty">위에서 제출 대상을 먼저 선택하세요.</div>:pending?<><div className="assignment-current"><strong>{pending.summary}</strong><span>담당자를 선택하세요.</span></div><div className="assignment-people">{teachers.map(teacher=><button type="button" key={teacher.id} disabled={busy} onClick={()=>void assign(teacher)}><strong>{teacher.name}</strong><span>{teacher.department}</span></button>)}</div><button type="button" className="text-button" onClick={()=>void cancelAssignment()}>배정 취소</button></>:<div className="assignment-empty">문서에서 커서 또는 셀 범위를 선택하고 <kbd>/</kbd>를 누르세요.</div>}</aside></div><div className="workspace-actions"><span className="subtle">{status}</span></div><details className="advanced-marker"><summary>고급 표식 방식</summary><p className="help">직접 지정하기 어려운 위치에는 [[입력]]을 넣은 뒤 변환할 수 있습니다.</p><button type="button" className="btn btn-secondary" disabled={!editorReady||busy} onClick={()=>void applyMarkers()}>표식 적용</button></details></div>}
    <input type="hidden" name="sharedFields" value={JSON.stringify(fields.map(({sourceName,label,assigneeId,required,initialContentMode})=>({sourceName,label,assigneeId,required,initialContentMode})))}/>
    {fields.length>0&&<div className="shared-field-list"><div className="notice">작성 영역 {fields.length}개를 찾았습니다. 배정 결과를 확인하세요.</div>{fields.map((field,index)=><div className="shared-field-config" key={field.sourceName}><div className="shared-field-config-head"><strong>{index+1}. {field.label}</strong><div className="mini-actions"><button type="button" disabled={index===0} onClick={()=>move(index,-1)}>←</button><button type="button" disabled={index===fields.length-1} onClick={()=>move(index,1)}>→</button></div></div><div className="shared-field-config-grid"><label>화면 이름<input value={field.label} maxLength={80} onChange={event=>update(index,{label:event.target.value})}/></label><label>담당자<select required value={field.assigneeId} onChange={event=>update(index,{assigneeId:event.target.value})}><option value="">선택하세요</option>{teachers.map(teacher=><option key={teacher.id} value={teacher.id}>{teacher.name} · {teacher.department}</option>)}</select></label><label>처음 보일 내용<select value={field.initialContentMode} onChange={event=>update(index,{initialContentMode:event.target.value as SharedFieldInitialContentMode})}><option value="template">양식의 기존 값</option><option value="blank">빈 입력란</option></select></label><label className="inline-check shared-required"><input type="checkbox" checked={field.required} onChange={event=>update(index,{required:event.target.checked})}/> 최종 제출 필수</label></div></div>)}</div>}
  </div>;
}
