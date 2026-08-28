"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PrepItem } from "@/lib/refresh";
import { FileDrop } from "./file-drop";
import { putHandoff } from "@/lib/handoff";
import { SchedulePopover } from "./schedule-popover";

type Analysis={items:PrepItem[];targetYear:number};

const GROUPS=[
  {kind:"연도",title:"연도 · 학년도",hint:"바꿀 값을 고르세요."},
  {kind:"회차",title:"회차 · 기수",hint:"해마다 올라갑니다. 값을 고르세요."},
  {kind:"날짜",title:"날짜",hint:"해가 바뀌면 요일이 달라집니다. 옆의 학사일정을 보고 새 날짜를 적거나, 비워 두고 나중에 채우세요."},
  {kind:"이름",title:"담당자 이름",hint:"바뀐 담당자를 적거나, 비워 두세요. 그대로라면 체크를 해제하세요."},
] as const;

/** 작년 완성본 하나로 올해 양식을 만든다. 바꿀 것과 비울 것을 한 화면에서 처리한다. */
export function PrepareClient({defaultYear}:{defaultYear:number}){
  const router=useRouter();
  const [file,setFile]=useState<File|null>(null);
  const [year,setYear]=useState(String(defaultYear));
  const [analysis,setAnalysis]=useState<Analysis|null>(null);
  const [picked,setPicked]=useState<Set<string>>(new Set());
  const [values,setValues]=useState<Record<string,string>>({});
  const [made,setMade]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");

  function reset(){setAnalysis(null);setPicked(new Set());setValues({});setMade(null);setError("");setStatus("")}

  async function scan(){
    if(!file){setError("작년 완성본(HWPX)을 선택하세요.");return}
    setBusy(true);setError("");setStatus("문서를 읽는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      form.set("targetYear",year);
      const response=await fetch("/api/prepare",{method:"POST",body:form});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      setAnalysis(body);
      setPicked(new Set(body.items.map((item:PrepItem)=>item.id)));
      setValues(Object.fromEntries(body.items.map((item:PrepItem)=>[item.id,item.suggested])));
      setStatus(body.items.length?`${body.items.length}곳을 찾았습니다. 확인 후 양식을 만드세요.`:"다룰 곳을 찾지 못했습니다.");
    }catch(cause){setError(cause instanceof Error?cause.message:"읽지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  async function make(){
    if(!file||!analysis)return;
    const chosen=analysis.items.filter(item=>picked.has(item.id));
    if(!chosen.length){setError("적용할 항목을 하나 이상 선택하세요.");return}
    setBusy(true);setError("");setStatus("양식을 만드는 중...");
    try{
      const form=new FormData();
      form.set("document",file);
      form.set("targetYear",year);
      form.set("accepted",JSON.stringify(chosen.map(item=>({from:item.text,to:values[item.id]??item.suggested}))));
      const response=await fetch("/api/prepare",{method:"POST",body:form});
      if(!response.ok)throw new Error((await response.json()).error);
      const blob=await response.blob();
      const name=decodeURIComponent(response.headers.get("X-Document-Name")||`${year}양식.hwpx`);
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");link.href=url;link.download=name;link.click();
      URL.revokeObjectURL(url);
      setMade(new File([blob],name,{type:"application/vnd.hancom.hwpx"}));
      const changed=chosen.filter(item=>values[item.id]).length;
      setStatus(`${changed}곳을 바꾸고 ${chosen.length-changed}곳을 비운 ${year}학년도 양식을 내려받았습니다.`);
    }catch(cause){setError(cause instanceof Error?cause.message:"만들지 못했습니다.");setStatus("")}
    finally{setBusy(false)}
  }

  async function handoff(){
    if(!made)return;
    setBusy(true);setError("");
    const ok=await putHandoff(made,file??undefined,Number(year));
    setBusy(false);
    if(!ok){setError("파일이 커서 자동으로 넘기지 못했습니다. 내려받은 파일을 취합 요청 화면에서 직접 올려 주세요.");return}
    router.push("/requests/new");
  }

  function toggle(id:string){setPicked(prev=>{const next=new Set(prev);if(next.has(id))next.delete(id);else next.add(id);return next})}
  const itemsOf=(kind:PrepItem["kind"])=>analysis?.items.filter(item=>item.kind===kind)??[];

  return <div style={{display:"grid",gap:16}}>
    <div className="card card-pad xlsx-panel">
      <div className="xlsx-step"><span>1</span><div>
        <strong>작년 완성본 올리기</strong>
        <p>작년에 작성을 마친 한글 파일(HWPX)을 선택하세요. 원본은 바뀌지 않습니다.</p>
        <FileDrop accept=".hwpx" hint="HWPX" file={file} onPick={next=>{setFile(next);reset()}}/>
      </div></div>
      <div className="xlsx-step"><span>2</span><div>
        <strong>몇 학년도 양식을 만들까요?</strong>
        <p>이 값을 기준으로 연도와 회차를 올립니다.</p>
        <input type="number" value={year} min={2000} max={2099} onChange={event=>{setYear(event.target.value);reset()}} style={{maxWidth:140}}/>
      </div></div>
      <div className="xlsx-step"><span>3</span><div>
        <strong>문서 읽기</strong>
        <p>바꿀 곳과 비울 곳을 한 번에 찾습니다.</p>
        <button className="btn btn-primary" disabled={busy||!file} onClick={()=>void scan()}>{busy?"처리 중...":"문서 읽기"}</button>
      </div></div>
      {status&&<p className="subtle">{status}</p>}
      {error&&<div className="error">{error}</div>}
    </div>

    {analysis&&analysis.items.length>0&&<div className="card card-pad">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div><strong style={{fontSize:16}}>{year}학년도 양식으로 만들기</strong>
          <p className="help" style={{margin:"4px 0 0"}}>체크한 항목만 적용됩니다. 표와 항목 이름은 그대로 남습니다.</p></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span className="badge badge-open">{picked.size} / {analysis.items.length} 선택</span>
          <SchedulePopover year={Number(year)}/>
        </div>
      </div>

      {GROUPS.map(group=>{
        const items=itemsOf(group.kind);
        if(!items.length)return null;
        // 날짜와 이름은 모두 비우므로 줄마다 늘어놓지 않고 알약처럼 촘촘히 보여 준다.
        const compact=group.kind==="날짜"||group.kind==="이름";
        const chosen=items.filter(item=>picked.has(item.id)).length;
        return <section key={group.kind} style={{marginTop:16}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
            <strong style={{fontSize:14}}>{group.title} ({items.length})</strong>
            {compact&&<>
              <span className="help">{chosen}개 바꿈 · 적지 않으면 비웁니다</span>
              <button type="button" className="link-button" onClick={()=>setPicked(prev=>{
                const next=new Set(prev);
                const all=items.every(item=>next.has(item.id));
                for(const item of items){if(all)next.delete(item.id);else next.add(item.id)}
                return next;
              })}>{items.every(item=>picked.has(item.id))?"이 묶음 해제":"이 묶음 선택"}</button>
            </>}
          </div>
          <p className="help" style={{margin:"2px 0 8px"}}>{group.hint}</p>

          {compact
            ?<div className="fill-list">
              {items.map(item=>{
                const on=picked.has(item.id);
                const value=values[item.id]??"";
                return <div key={item.id} className={`fill-row${on?" is-on":""}`}>
                  <input type="checkbox" checked={on} onChange={()=>toggle(item.id)} aria-label={`${item.text} 바꾸기`}/>
                  <code className="fill-from">{item.text}</code>
                  {item.count>1&&<em className="fill-count">{item.count}곳</em>}
                  <span aria-hidden>→</span>
                  <input className="fill-input" type="text" value={value} disabled={!on}
                    placeholder={group.kind==="날짜"?"새 날짜 (비우려면 그대로)":"새 이름 (비우려면 그대로)"}
                    onChange={event=>setValues(prev=>({...prev,[item.id]:event.target.value}))}/>
                </div>;
              })}
            </div>
            :<div style={{display:"grid",gap:6}}>
              {items.map(item=><label key={item.id} className="teacher-check" style={{cursor:"pointer",textAlign:"left",alignItems:"center"}}>
                <input type="checkbox" checked={picked.has(item.id)} onChange={()=>toggle(item.id)}/>
                <span style={{flex:1,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <code style={{background:"#fee",padding:"2px 6px",borderRadius:4}}>{item.text}</code>
                  <span aria-hidden>→</span>
                  <select value={values[item.id]??item.suggested} disabled={!picked.has(item.id)}
                    onChange={event=>setValues(prev=>({...prev,[item.id]:event.target.value}))}
                    onClick={event=>event.preventDefault()}>
                    {item.options?.map(option=><option key={option} value={option}>{option}</option>)}
                  </select>
                  {item.count>1&&<span className="help">문서에 {item.count}곳</span>}
                </span>
              </label>)}
            </div>}
        </section>;
      })}

      <div className="action-buttons" style={{marginTop:18}}>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setPicked(new Set(analysis.items.map(item=>item.id)))}>전체 선택</button>
        <button className="btn btn-secondary" disabled={busy} onClick={()=>setPicked(new Set())}>전체 해제</button>
        <button className="btn btn-primary" disabled={busy||!picked.size} onClick={()=>void make()}>{busy?"처리 중...":`${year}학년도 양식 만들어 내려받기`}</button>
      </div>
    </div>}

    {made&&<div className="card card-pad" style={{borderColor:"#2e7d32"}}>
      <strong style={{fontSize:16}}>이어서 취합 요청 만들기</strong>
      <p className="help" style={{margin:"4px 0 12px"}}>방금 만든 {year}학년도 양식과 올려 주신 작년 완성본을 그대로 넣어 둡니다. 제목과 마감일만 정하면 됩니다.</p>
      <div className="action-buttons">
        <button className="btn btn-primary" disabled={busy} onClick={()=>void handoff()}>이 양식으로 취합 요청 만들기</button>
      </div>
    </div>}
  </div>;
}
