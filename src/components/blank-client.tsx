"use client";

import { useState } from "react";
import type { BlankTarget } from "@/lib/refresh";

const KIND_COLOR:Record<BlankTarget["kind"],string>={날짜:"#fff4d6",연도:"#e3f1ff",이름:"#f0e6ff",숫자:"#eef"};

/** 작년 완성본에서 채워 넣은 값만 지워 빈 양식을 만든다. */
export function BlankClient(){
  const [file,setFile]=useState<File|null>(null);
  const [targets,setTargets]=useState<BlankTarget[]|null>(null);
  const [chosen,setChosen]=useState<Set<string>>(new Set());
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");

  function reset(){setTargets(null);setChosen(new Set());setError("");setStatus("")}

  async function scan(){
    if(!file){setError("작년 완성본(HWPX)을 선택하세요.");return}
    setBusy(true);setError("");setStatus("문서에서 지울 값을 찾는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      const response=await fetch("/api/blank",{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      setTargets(body.targets);
      // 날짜는 해마다 반드시 다시 정하므로 기본 선택, 나머지는 담당자가 고르게 둔다.
      setChosen(new Set(body.targets.filter((t:BlankTarget)=>t.kind==="날짜").map((t:BlankTarget)=>t.id)));
      setStatus(body.targets.length?`${body.targets.length}개를 찾았습니다. 비울 것만 체크하세요.`:"지울 값을 찾지 못했습니다.");
    }catch(cause){setError(cause instanceof Error?cause.message:"찾지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  async function make(){
    if(!file||!targets)return;
    const picked=targets.filter(t=>chosen.has(t.id));
    if(!picked.length){setError("비울 항목을 하나 이상 선택하세요.");return}
    setBusy(true);setError("");setStatus("빈 양식을 만드는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      form.set("accepted",JSON.stringify(picked.map(({text})=>({text}))));
      const response=await fetch("/api/blank",{method:"POST",body:form});
      if(!response.ok)throw new Error((await response.json()).error);
      const blob=await response.blob();
      const name=decodeURIComponent(response.headers.get("X-Document-Name")||"빈양식.hwpx");
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");link.href=url;link.download=name;link.click();
      URL.revokeObjectURL(url);
      setStatus(`${picked.length}곳을 비운 빈 양식을 내려받았습니다.`);
    }catch(cause){setError(cause instanceof Error?cause.message:"만들지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  function toggle(id:string){setChosen(prev=>{const next=new Set(prev);if(next.has(id))next.delete(id);else next.add(id);return next})}
  const byKind=(kind:BlankTarget["kind"])=>targets?.filter(t=>t.kind===kind)??[];

  return <div style={{display:"grid",gap:16}}>
    <div className="card card-pad xlsx-panel">
      <div className="xlsx-step"><span>1</span><div>
        <strong>작년 완성본 올리기</strong>
        <p>작년에 작성을 마친 한글 파일(HWPX)을 선택하세요. 원본은 바뀌지 않습니다.</p>
        <input type="file" accept=".hwpx" onChange={event=>{setFile(event.target.files?.[0]??null);reset()}}/>
        {file&&<p className="help">선택: {file.name}</p>}
      </div></div>
      <div className="xlsx-step"><span>2</span><div>
        <strong>지울 값 찾기</strong>
        <p>표와 항목 이름은 그대로 두고, 해마다 다시 쓰는 값만 찾습니다.</p>
        <button className="btn btn-primary" disabled={busy||!file} onClick={()=>void scan()}>{busy?"처리 중...":"지울 값 찾기"}</button>
      </div></div>
      {status&&<p className="subtle">{status}</p>}
      {error&&<div className="error">{error}</div>}
    </div>

    {targets&&targets.length>0&&<div className="card card-pad">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div><strong style={{fontSize:16}}>비울 값 고르기</strong>
          <p className="help" style={{margin:"4px 0 0"}}>체크한 값만 지워집니다. 항목 이름과 표 구조는 그대로 남습니다.</p></div>
        <span className="badge badge-open">{chosen.size} / {targets.length} 선택</span>
      </div>

      {(["날짜","연도","이름","숫자"] as const).map(kind=>byKind(kind).length>0&&<div key={kind} style={{marginTop:16}}>
        <strong style={{fontSize:14}}>{kind} ({byKind(kind).length})</strong>
        {kind==="연도"&&<p className="help" style={{margin:"2px 0 6px"}}>연도는 비우기보다 <a href="/refresh" style={{color:"var(--navy)",fontWeight:700}}>양식 갱신</a>으로 올해 값으로 바꾸는 편이 낫습니다.</p>}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
          {byKind(kind).map(item=><label key={item.id} style={{display:"inline-flex",alignItems:"center",gap:6,border:"1px solid #d8dee9",borderRadius:6,padding:"4px 8px",cursor:"pointer",background:chosen.has(item.id)?KIND_COLOR[kind]:"#fff"}}>
            <input type="checkbox" checked={chosen.has(item.id)} onChange={()=>toggle(item.id)}/>
            <code>{item.text}</code>
            {item.count>1&&<span className="help">×{item.count}</span>}
          </label>)}
        </div>
      </div>)}

      <div className="action-buttons" style={{marginTop:18}}>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setChosen(new Set(targets.map(t=>t.id)))}>전체 선택</button>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setChosen(new Set())}>전체 해제</button>
        <button className="btn btn-primary" disabled={busy||!chosen.size} onClick={()=>void make()}>{busy?"처리 중...":"빈 양식 만들어 내려받기"}</button>
      </div>
      <p className="help" style={{marginTop:10}}>내려받은 빈 양식은 취합 요청의 &quot;작성 양식&quot;으로, 원본 완성본은 &quot;작년 자료&quot;로 올리면 됩니다.</p>
    </div>}
  </div>;
}
