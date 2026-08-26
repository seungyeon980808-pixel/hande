"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import type { RhwpEditor as RhwpEditorApi } from "@rhwp/editor";

type Person={id:string;name:string;department:string};

export function RhwpEditor({token,person}:{token:string;person:Person}){
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
      const time=new Date(body.updatedAt).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
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
        if(!container.current)return;
        const instance=await createEditor(container.current,{height:"590px",studioUrl:process.env.NEXT_PUBLIC_RHWP_STUDIO_URL||"https://edwardkim.github.io/rhwp/"});
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
          if(restored){const updated=draftResponse.headers.get("X-Draft-Updated-At");setStatus(`임시저장 문서를 복구했습니다${updated?` · ${new Date(updated).toLocaleString("ko-KR")}`:""}`)}else{setStatus("작성 중인 문서는 1분마다 이 기기에 임시저장됩니다.")}
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

  return <div className="card card-pad">
    {error&&<div className="error" style={{marginBottom:12}}>{error}<br/><span className="help">rHWP가 열리지 않으면 학교망에서 Studio 주소 접근이 가능한지 확인해야 합니다.</span></div>}
    {saveError&&<div className="error" style={{marginBottom:12}}>{saveError}</div>}
    {done&&<div className="success" style={{marginBottom:12}}>제출 완료. 제출본은 버전으로 보관됐습니다. 다시 수정한다면 먼저 임시저장 버튼을 눌러 주세요.</div>}
    <div className="editor-box" ref={container}/>
    <div className="editor-actions">
      <span className="subtle">{status}</span>
      <div className="action-buttons">
        <button className="btn btn-secondary" disabled={!ready||busy||!!error} onClick={()=>{autoSaveEnabled.current=true;void saveDraft(true)}}>임시저장</button>
        <button className="btn btn-primary" disabled={!ready||busy||!!error} onClick={submit}>{busy?"제출 중...":"작성 문서 제출"}</button>
      </div>
    </div>
  </div>;
}
