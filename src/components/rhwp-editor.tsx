"use client";

import { formatDateTime,formatTime } from "@/lib/datetime";

import { useCallback,useEffect,useRef,useState } from "react";
import type { RhwpEditor as RhwpEditorApi } from "@rhwp/editor";
import { getRhwpStudioUrl } from "@/lib/rhwp-studio-url";
import { ReviewPanel } from "./review-panel";
import { ReferenceViewer } from "./reference-viewer";
import { SchedulePopover } from "./schedule-popover";

type Person={id:string;name:string;department:string};

export function RhwpEditor({token,person,hasReference=false,targetYear}:{token:string;person:Person;hasReference?:boolean;targetYear:number}){
  const container=useRef<HTMLDivElement>(null);
  const editor=useRef<RhwpEditorApi|null>(null);
  const draftKey=useRef("");
  const saving=useRef(false);
  const autoSaveEnabled=useRef(true);
  const [ready,setReady]=useState(false);
  const [status,setStatus]=useState("편집기 준비 중...");
  const [error,setError]=useState("");
  const [saveError,setSaveError]=useState("");
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [sideBySide,setSideBySide]=useState(hasReference);
  const [fullscreen,setFullscreen]=useState(false);
  // 학사일정 창이 오른쪽에 뜨므로 작성 문서를 왼쪽으로 보낼 수 있게 한다.
  const [swapped,setSwapped]=useState(false);

  const saveDraft=useCallback(async(manual:boolean)=>{
    if(!editor.current||!draftKey.current||saving.current)return;
    saving.current=true;
    setSaveError("");
    setStatus(manual?"임시저장 중...":"자동 임시저장 중...");
    try{
      const bytes=await editor.current.exportHwpx();
      const form=new FormData();
      form.set("teacherId",person.id);
      form.set("draftKey",draftKey.current);
      form.set("document",new File([new Uint8Array(bytes).buffer],`${person.name}_${person.department}_임시저장.hwpx`,{type:"application/vnd.hancom.hwpx"}));
      const response=await fetch(`/api/collect/${token}/draft`,{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      const time=formatTime(body.updatedAt);
      setStatus(`${manual?"임시저장":"자동저장"} 완료 · ${time}`);
    }catch(cause){
      setSaveError(cause instanceof Error?cause.message:"임시저장하지 못했습니다.");
      setStatus("임시저장 실패 · 작성 내용은 브라우저 복구본에 유지됩니다.");
    }finally{saving.current=false}
  },[person.department,person.id,person.name,token]);

  useEffect(()=>{
    let active=true;
    let interval:number|undefined;
    autoSaveEnabled.current=true;
    (async()=>{
      try{
        const storageKey=`school-work-draft:${token}:${person.id}`;
        let key=localStorage.getItem(storageKey);
        if(!key){key=crypto.randomUUID();localStorage.setItem(storageKey,key)}
        draftKey.current=key;
        const {createEditor}=await import("@rhwp/editor");
        // 개발 모드의 이중 실행이나 재렌더로 편집기가 두 번 생기는 것을 막는다.
        if(!container.current||editor.current)return;
        container.current.replaceChildren();
        const instance=await createEditor(container.current,{height:"100%",studioUrl:getRhwpStudioUrl()});
        editor.current=instance;
        const draftResponse=await fetch(`/api/collect/${token}/draft?teacherId=${encodeURIComponent(person.id)}&draftKey=${encodeURIComponent(key)}`);
        let documentResponse=draftResponse;
        let restored=false;
        if(draftResponse.status===204){documentResponse=await fetch(`/api/collect/${token}/template?teacherId=${encodeURIComponent(person.id)}`)}else if(!draftResponse.ok){throw new Error((await draftResponse.json()).error)}else{restored=true}
        if(!documentResponse.ok)throw new Error((await documentResponse.json()).error);
        const name=documentResponse.headers.get("X-Document-Name")||"template.hwpx";
        await instance.loadFile(await documentResponse.arrayBuffer(),decodeURIComponent(name));
        if(active){
          setReady(true);
          if(restored){const updated=draftResponse.headers.get("X-Draft-Updated-At");setStatus(`임시저장 문서를 복구했습니다${updated?` · ${formatDateTime(updated)}`:""}`)}else{setStatus("작성 중인 문서는 1분마다 이 기기에 임시저장됩니다.")}
          interval=window.setInterval(()=>{if(autoSaveEnabled.current)void saveDraft(false)},60_000);
        }
      }catch(cause){if(active)setError(cause instanceof Error?cause.message:"편집기를 열지 못했습니다.")}
    })();
    return()=>{active=false;if(interval)window.clearInterval(interval);editor.current?.destroy();editor.current=null};
  },[person.id,saveDraft,token]);

  async function submit(){
    if(!editor.current)return;
    setBusy(true);setError("");setSaveError("");
    try{
      const bytes=await editor.current.exportHwpx();
      const form=new FormData();
      form.set("teacherId",person.id);
      form.set("draftKey",draftKey.current);
      form.set("document",new File([new Uint8Array(bytes).buffer],`${person.name}_${person.department}.hwpx`,{type:"application/vnd.hancom.hwpx"}));
      const response=await fetch(`/api/collect/${token}/submissions`,{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      await editor.current.notifySaved();
      autoSaveEnabled.current=false;
      setDone(true);
      setStatus(`${body.version}차 제출 완료 · 서버 임시저장은 정리되었습니다.`);
    }catch(cause){setError(cause instanceof Error?cause.message:"제출하지 못했습니다.")}
    finally{setBusy(false)}
  }

  async function currentBytes(){
    if(!editor.current)return null;
    const bytes=await editor.current.exportHwpx();
    return {bytes:new Uint8Array(bytes).buffer as ArrayBuffer,name:`${person.name}_작성중.hwpx`};
  }
  /** 검토에서 고른 항목을 편집기의 현재 문서에 바로 반영한다. */
  async function applyToDocument(pairs:{from:string;to:string}[]){
    if(!editor.current)throw new Error("편집기가 준비되지 않았습니다.");
    const current=await editor.current.exportHwpx();
    const form=new FormData();
    form.set("document",new File([new Uint8Array(current).buffer],`${person.name}_작성중.hwpx`,{type:"application/vnd.hancom.hwpx"}));
    form.set("accepted",JSON.stringify(pairs));
    const response=await fetch("/api/refresh/apply",{method:"POST",body:form});
    if(!response.ok)throw new Error((await response.json()).error);
    await editor.current.loadFile(await response.arrayBuffer(),`${person.name}_작성중.hwpx`);
  }

  async function referenceBytes(){
    const response=await fetch(`/api/collect/${token}/reference?teacherId=${encodeURIComponent(person.id)}`);
    if(!response.ok)throw new Error((await response.json()).error);
    return {bytes:await response.arrayBuffer(),name:decodeURIComponent(response.headers.get("X-Document-Name")||"작년자료.hwpx")};
  }

  // Esc 로 전체화면 해제
  useEffect(()=>{
    if(!fullscreen)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setFullscreen(false)};
    window.addEventListener("keydown",onKey);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",onKey);document.body.style.overflow=""};
  },[fullscreen]);

  return <div className={fullscreen?"editor-fullscreen":undefined}>
    {fullscreen&&<div className="editor-fullscreen-bar">
      <strong>{person.name} · {person.department}</strong>
      <span className={error||saveError?"error-inline":"help"}>{error||saveError||(done?"제출 완료 · 버전으로 보관됐습니다":status)}</span>
      <div className="action-buttons">
        <SchedulePopover year={targetYear}/>
        {hasReference&&<button className="btn btn-secondary" onClick={()=>setSideBySide(v=>!v)}>{sideBySide?"작년 자료 닫기":"작년 자료 열기"}</button>}
        {hasReference&&sideBySide&&<button className="btn btn-secondary" onClick={()=>setSwapped(v=>!v)}>좌우 바꾸기</button>}
        <button className="btn btn-secondary" disabled={!ready||busy||!!error} onClick={()=>{autoSaveEnabled.current=true;void saveDraft(true)}}>임시저장</button>
        <button className="btn btn-primary" disabled={!ready||busy||!!error} onClick={submit}>{busy?"제출 중...":"제출"}</button>
        <button className="btn btn-secondary" onClick={()=>setFullscreen(false)}>끝내기 (Esc)</button>
      </div>
    </div>}
    {!fullscreen&&hasReference&&<ReviewPanel mode="before" targetYear={targetYear} loadDocument={referenceBytes}
      label="작성 전 미리보기 · 작년 문서에서 바꿀 곳" hint="작년 자료를 AI가 미리 읽고, 올해 바꿔야 할 곳을 알려 줍니다."
      buttonLabel="바꿀 곳 미리보기"/>}
    {!fullscreen&&<div className="card card-pad" style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <div><strong style={{fontSize:15}}>{hasReference?"작년 자료 나란히 보기":"넓게 보기"}</strong>
        <p className="help" style={{margin:"4px 0 0"}}>{hasReference?"왼쪽 작년 문서에서 글이나 표를 복사해 오른쪽에 붙여넣을 수 있습니다.":"화면을 꽉 채워 편집합니다. Esc 키로 빠져나옵니다."}</p></div>
      <div className="action-buttons">
        <SchedulePopover year={targetYear}/>
        {hasReference&&<button className="btn btn-secondary" onClick={()=>setSideBySide(v=>!v)}>{sideBySide?"작년 자료 닫기":"작년 자료 열기"}</button>}
        {hasReference&&sideBySide&&<button className="btn btn-secondary" onClick={()=>setSwapped(v=>!v)}>좌우 바꾸기</button>}
        <button className="btn btn-primary" onClick={()=>setFullscreen(true)}>전체화면으로 편집</button>
      </div>
    </div>}

    <div className="card card-pad">
    {!fullscreen&&error&&<div className="error" style={{marginBottom:12}}>{error}<br/><span className="help">rHWP가 열리지 않으면 학교망에서 Studio 주소 접근이 가능한지 확인해야 합니다.</span></div>}
    {!fullscreen&&saveError&&<div className="error" style={{marginBottom:12}}>{saveError}</div>}
    {!fullscreen&&done&&<div className="success" style={{marginBottom:12}}>제출 완료. 제출본은 버전으로 보관됐습니다. 다시 수정한다면 먼저 임시저장 버튼을 눌러 주세요.</div>}
    <div className="side-by-side" data-open={sideBySide&&hasReference?"true":"false"}>
      {sideBySide&&hasReference&&<div className="side-pane" style={{order:swapped?2:1}}>
        <ReferenceViewer token={token} personId={person.id}/>
      </div>}
      <div className="side-pane" style={{order:swapped?1:2}}>
        {sideBySide&&hasReference&&<div className="side-pane-head">올해 작성 문서</div>}
        <div className="editor-box" ref={container}/>
      </div>
    </div>
    {!fullscreen&&<div className="editor-actions">
      <span className="subtle">{status}</span>
      <div className="action-buttons">
        <button className="btn btn-secondary" disabled={!ready||busy||!!error} onClick={()=>{autoSaveEnabled.current=true;void saveDraft(true)}}>임시저장</button>
        <button className="btn btn-primary" disabled={!ready||busy||!!error} onClick={submit}>{busy?"제출 중...":"작성 문서 제출"}</button>
      </div>
    </div>}
    </div>

    {!fullscreen&&<ReviewPanel mode="final" targetYear={targetYear} loadDocument={currentBytes} disabled={!ready} onApply={applyToDocument}
      label="제출 전 최종 점검" hint="다 쓰신 뒤 눌러 주세요. 작년 내용이 남았거나 빈칸이 있는지 확인합니다."
      buttonLabel="제출 전 점검하기"/>}
  </div>;
}