"use client";

import { useState } from "react";

type Note={id:string;level:"확인"|"주의";kind:"담당자"|"일정"|"연도"|"내용";where:string;text:string};
type Leftover={id:string;text:string;to:string;count:number;hint:string};
type Warning={id:string;text:string;detail:string};
type Result={mode:"before"|"final";targetYear:number;notes:Note[];leftovers:Leftover[];warnings:Warning[];aiEnabled:boolean;aiError?:string};

const KIND_LABEL={담당자:"담당자 이름",일정:"날짜·기간",연도:"연도·학년도",내용:"그 밖의 내용"} as const;

/**
 * 문서를 AI와 규칙으로 검토해 확인할 지점을 종류별로 모아 보여 준다.
 * 바꿀 값이 확정된 것만 체크해서 한 번에 반영할 수 있다.
 */
export function ReviewPanel({label,hint,loadDocument,targetYear,mode,disabled=false,onApply,buttonLabel="AI 검토"}:{
  label:string;hint:string;mode:"before"|"final";targetYear:number;disabled?:boolean;buttonLabel?:string;
  loadDocument:()=>Promise<{bytes:ArrayBuffer;name:string}|null>;
  onApply?:(pairs:{from:string;to:string}[])=>Promise<void>;
}){
  const [result,setResult]=useState<Result|null>(null);
  const [picked,setPicked]=useState<Set<string>>(new Set());
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");
  const [open,setOpen]=useState(false);

  async function run(){
    setBusy(true);setError("");setStatus("");
    try{
      const doc=await loadDocument();
      if(!doc)throw new Error("검토할 문서를 준비하지 못했습니다.");
      const form=new FormData();
      form.set("document",new File([doc.bytes],doc.name,{type:"application/vnd.hancom.hwpx"}));
      form.set("mode",mode);
      form.set("targetYear",String(targetYear));
      const response=await fetch("/api/review",{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      setResult(body);
      setPicked(new Set(body.leftovers.map((item:Leftover)=>item.id)));
      setOpen(true);
    }catch(cause){setError(cause instanceof Error?cause.message:"검토하지 못했습니다.")}
    finally{setBusy(false)}
  }

  async function apply(){
    if(!result||!onApply)return;
    const pairs=result.leftovers.filter(item=>picked.has(item.id)).map(({text,to})=>({from:text,to}));
    if(!pairs.length){setError("반영할 항목을 하나 이상 선택하세요.");return}
    setBusy(true);setError("");
    try{
      await onApply(pairs);
      setStatus(`${pairs.length}곳을 문서에 반영했습니다.`);
      setResult({...result,leftovers:result.leftovers.filter(item=>!picked.has(item.id))});
      setPicked(new Set());
    }catch(cause){setError(cause instanceof Error?cause.message:"반영하지 못했습니다.")}
    finally{setBusy(false)}
  }

  function toggle(id:string){setPicked(prev=>{const next=new Set(prev);if(next.has(id))next.delete(id);else next.add(id);return next})}
  const notesOf=(kind:Note["kind"])=>result?.notes.filter(note=>note.kind===kind)??[];
  const total=result?result.notes.length+result.leftovers.length+result.warnings.length:0;

  return <div className="card card-pad" style={{marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <div>
        <strong style={{fontSize:15}}>{label}</strong>
        <p className="help" style={{margin:"4px 0 0"}}>{hint}</p>
      </div>
      <div className="action-buttons">
        {result&&<button className="btn btn-secondary" onClick={()=>setOpen(value=>!value)}>{open?"접기":`결과 보기 (${total})`}</button>}
        <button className="btn btn-secondary" disabled={busy||disabled} onClick={()=>void run()}>{busy?"확인 중...":disabled?"편집기 준비 중":result?"다시 확인":buttonLabel}</button>
      </div>
    </div>
    {error&&<div className="error" style={{marginTop:10}}>{error}</div>}
    {status&&<div className="success" style={{marginTop:10}}>{status}</div>}

    {result&&open&&<div style={{marginTop:14}}>
      {!result.aiEnabled&&<div className="notice">AI 키가 없어 <strong>규칙으로 확인한 것만</strong> 표시합니다.</div>}
      {result.aiError&&result.aiEnabled&&<div className="notice">AI 검토를 받지 못했습니다({result.aiError}). 규칙 결과만 표시합니다.</div>}
      {total===0&&<p className="subtle">확인할 곳을 찾지 못했습니다.</p>}

      {result.leftovers.length>0&&<section style={{marginTop:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <strong style={{fontSize:14}}>바로 반영할 수 있는 곳 ({result.leftovers.length})</strong>
          <span className="help">{picked.size}개 선택</span>
        </div>
        <div style={{display:"grid",gap:6,marginTop:8}}>
          {result.leftovers.map(item=><label key={item.id} className="teacher-check" style={{cursor:"pointer",textAlign:"left"}}>
            <input type="checkbox" checked={picked.has(item.id)} onChange={()=>toggle(item.id)}/>
            <span style={{flex:1}}>
              <code style={{background:"#fee",padding:"2px 6px",borderRadius:4}}>{item.text}</code>
              {" → "}
              <code style={{background:"#efe",padding:"2px 6px",borderRadius:4}}>{item.to}</code>
              <span className="help" style={{display:"block",marginTop:2}}>문서에 {item.count}곳</span>
            </span>
          </label>)}
        </div>
        <div className="action-buttons" style={{marginTop:10}}>
          <button className="btn btn-secondary" disabled={busy} onClick={()=>setPicked(new Set(result.leftovers.map(item=>item.id)))}>전체 선택</button>
          <button className="btn btn-secondary" disabled={busy} onClick={()=>setPicked(new Set())}>전체 해제</button>
          {onApply&&<button className="btn btn-primary" disabled={busy||!picked.size} onClick={()=>void apply()}>{busy?"반영 중...":"선택 항목 문서에 반영"}</button>}
        </div>
      </section>}

      {(["담당자","일정","연도","내용"] as const).map(kind=>{
        const items=notesOf(kind);
        const dates=kind==="일정"?result.warnings:[];
        if(!items.length&&!dates.length)return null;
        return <section key={kind} style={{marginTop:18}}>
          <strong style={{fontSize:14}}>{KIND_LABEL[kind]} ({items.length+dates.length})</strong>
          {kind==="일정"&&dates.length>0&&<p className="help" style={{margin:"2px 0 0"}}>해가 바뀌면 요일이 달라지므로 자동으로 바꾸지 않습니다.</p>}
          <div style={{display:"grid",gap:6,marginTop:8}}>
            {items.map(item=><div key={item.id} className="notice" style={{margin:0}}>
              <span className="badge" style={{marginRight:6}}>{item.level}</span>
              {item.where&&<code style={{background:"#eef",padding:"2px 6px",borderRadius:4}}>{item.where}</code>}
              <span className="help" style={{display:"block",marginTop:4}}>{item.text}</span>
            </div>)}
            {dates.map(item=><div key={item.id} className="notice" style={{margin:0}}>
              <code style={{background:"#fff4d6",padding:"2px 6px",borderRadius:4,fontWeight:700}}>{item.text}</code>
              <span className="help" style={{display:"block",marginTop:4}}>{item.detail}</span>
            </div>)}
          </div>
        </section>;
      })}

      <p className="help" style={{marginTop:12}}>AI 검토는 참고용입니다. 최종 확인은 작성자가 해야 합니다.</p>
    </div>}
  </div>;
}
