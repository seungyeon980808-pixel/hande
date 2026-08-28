"use client";

import { useState } from "react";
import type { Suggestion,Warning } from "@/lib/refresh";
import { FileDrop } from "./file-drop";

type Analysis={suggestions:Suggestion[];warnings:Warning[];targetYear:number;aiEnabled:boolean;aiError?:string;textLength:number};

export function RefreshClient({defaultYear}:{defaultYear:number}){
  const [file,setFile]=useState<File|null>(null);
  const [year,setYear]=useState(String(defaultYear));
  const [analysis,setAnalysis]=useState<Analysis|null>(null);
  const [accepted,setAccepted]=useState<Set<string>>(new Set());
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");

  function reset(){setAnalysis(null);setAccepted(new Set());setError("");setStatus("")}

  async function analyze(){
    if(!file){setError("작년 양식 파일(HWPX)을 선택하세요.");return}
    setBusy(true);setError("");setStatus("문서를 읽고 바꿀 곳을 찾는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      form.set("targetYear",year);
      const response=await fetch("/api/refresh/analyze",{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      setAnalysis(body);
      setAccepted(new Set(body.suggestions.map((s:Suggestion)=>s.id)));
      const warnCount=body.warnings?.length??0;
      setStatus(body.suggestions.length
        ?`바꿀 곳 ${body.suggestions.length}곳${warnCount?`, 직접 확인할 곳 ${warnCount}곳`:""}을 찾았습니다.`
        :warnCount?`자동으로 바꿀 곳은 없고, 직접 확인할 곳 ${warnCount}곳이 있습니다.`:"바꿀 곳을 찾지 못했습니다. 이미 최신 양식일 수 있습니다.");
    }catch(cause){setError(cause instanceof Error?cause.message:"분석하지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  async function apply(){
    if(!file||!analysis)return;
    const chosen=analysis.suggestions.filter(s=>accepted.has(s.id));
    if(!chosen.length){setError("반영할 항목을 하나 이상 선택하세요.");return}
    setBusy(true);setError("");setStatus("문서에 반영하는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      form.set("accepted",JSON.stringify(chosen.map(({from,to})=>({from,to}))));
      const response=await fetch("/api/refresh/apply",{method:"POST",body:form});
      if(!response.ok)throw new Error((await response.json()).error);
      const blob=await response.blob();
      const name=decodeURIComponent(response.headers.get("X-Document-Name")||"갱신본.hwpx");
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;link.download=name;link.click();
      URL.revokeObjectURL(url);
      setStatus(`${chosen.length}곳을 반영한 파일을 내려받았습니다.`);
    }catch(cause){setError(cause instanceof Error?cause.message:"반영하지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  function toggle(id:string){setAccepted(prev=>{const next=new Set(prev);if(next.has(id))next.delete(id);else next.add(id);return next})}

  return <div style={{display:"grid",gap:16}}>
    <div className="card card-pad xlsx-panel">
      <div className="xlsx-step"><span>1</span><div>
        <strong>작년 양식 올리기</strong>
        <p>작년에 쓰던 한글 파일(HWPX)을 선택하세요. 원본은 바뀌지 않습니다.</p>
        <FileDrop accept=".hwpx" hint="HWPX" file={file} onPick={next=>{setFile(next);reset()}}/>
      </div></div>
      <div className="xlsx-step"><span>2</span><div>
        <strong>기준 학년도</strong>
        <p>어느 해 기준으로 바꿀지 정합니다.</p>
        <input type="number" value={year} min={2000} max={2099} onChange={event=>{setYear(event.target.value);reset()}} style={{maxWidth:140}}/>
      </div></div>
      <div className="xlsx-step"><span>3</span><div>
        <strong>바꿀 곳 찾기</strong>
        <p>규칙으로 확실한 것을 먼저 찾고, AI가 놓친 곳을 더 찾아 줍니다.</p>
        <button className="btn btn-primary" disabled={busy||!file} onClick={()=>void analyze()}>{busy?"처리 중...":"바꿀 곳 찾기"}</button>
      </div></div>
      {status&&<p className="subtle">{status}</p>}
      {error&&<div className="error">{error}</div>}
    </div>

    {analysis&&<div className="card card-pad">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div>
          <strong style={{fontSize:16}}>{analysis.targetYear}학년도로 바꿀 곳</strong>
          <p className="help" style={{margin:"4px 0 0"}}>체크된 항목만 반영됩니다. 확인 후 아래 버튼을 누르세요.</p>
        </div>
        <span className="badge badge-open">{accepted.size} / {analysis.suggestions.length} 선택</span>
      </div>

      {!analysis.aiEnabled&&<div className="notice" style={{marginTop:12}}>
        AI 키가 설정되어 있지 않아 <strong>규칙으로 찾은 결과만</strong> 표시했습니다. 연도 같은 확실한 항목은 그대로 찾아 줍니다.
      </div>}
      {analysis.aiError&&<div className="notice" style={{marginTop:12}}>
        AI 제안을 받지 못했습니다({analysis.aiError}). 규칙으로 찾은 결과만 표시합니다.
      </div>}

      {analysis.suggestions.length===0
        ?<p className="subtle" style={{marginTop:16}}>바꿀 곳을 찾지 못했습니다.</p>
        :<div style={{display:"grid",gap:8,marginTop:16}}>
          {analysis.suggestions.map(item=><label key={item.id} className="teacher-check" style={{alignItems:"flex-start",cursor:"pointer",textAlign:"left"}}>
            <input type="checkbox" checked={accepted.has(item.id)} onChange={()=>toggle(item.id)} style={{marginTop:4}}/>
            <span style={{flex:1}}>
              <span style={{display:"block"}}>
                <code style={{background:"#fee",padding:"2px 6px",borderRadius:4}}>{item.from}</code>
                {" → "}
                <code style={{background:"#efe",padding:"2px 6px",borderRadius:4}}>{item.to}</code>
              </span>
              <span className="help" style={{display:"block",marginTop:4}}>{item.reason} · 문서에 {item.count}곳</span>
            </span>
            <span className="badge">{item.source==="rule"?"규칙":"AI"}</span>
          </label>)}
        </div>}

      {analysis.warnings?.length>0&&<div style={{marginTop:20}}>
        <strong style={{fontSize:15}}>직접 확인해야 할 곳</strong>
        <p className="help" style={{margin:"4px 0 10px"}}>해가 바뀌면 요일이 달라지므로 자동으로 바꾸지 않습니다. 아래를 보고 직접 정하세요.</p>
        <div style={{display:"grid",gap:8}}>
          {analysis.warnings.map(item=><div key={item.id} className="notice" style={{margin:0}}>
            <code style={{background:"#fff4d6",padding:"2px 6px",borderRadius:4,fontWeight:700}}>{item.text}</code>
            <span className="help" style={{display:"block",marginTop:4}}>{item.detail}</span>
          </div>)}
        </div>
      </div>}

      {analysis.suggestions.length>0&&<div className="action-buttons" style={{marginTop:16}}>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setAccepted(new Set(analysis.suggestions.map(s=>s.id)))}>전체 선택</button>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setAccepted(new Set())}>전체 해제</button>
        <button className="btn btn-primary" disabled={busy||!accepted.size} onClick={()=>void apply()}>{busy?"처리 중...":"선택 항목 반영해 내려받기"}</button>
      </div>}
    </div>}
  </div>;
}
