"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PrepItem } from "@/lib/refresh";
import { FileDrop } from "./file-drop";
import { putHandoff } from "@/lib/handoff";
import { SchedulePopover } from "./schedule-popover";
import { DatePicker,SourceDate } from "./mini-calendar";

type Analysis={items:PrepItem[];targetYear:number;sourceYear:number};

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
  const [detail,setDetail]=useState(false);

  function reset(){setAnalysis(null);setPicked(new Set());setValues({});setMade(null);setError("");setStatus("");setDetail(false)}

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
      <strong style={{fontSize:16}}>{year}학년도 양식으로 만듭니다</strong>
      <p className="help" style={{margin:"4px 0 14px"}}>표와 항목 이름은 그대로 두고 아래만 손봅니다.</p>

      <div className="prep-summary">
        {itemsOf("연도").length>0&&<div className="prep-line">
          <span className="prep-tag is-change">바꿈</span>
          <span>연도 · 학년도</span>
          <span className="prep-detail">
            {itemsOf("연도").map(item=><span key={item.id} className="prep-pair">
              <code>{item.text}</code> →
              <select value={values[item.id]??item.suggested}
                onChange={event=>setValues(prev=>({...prev,[item.id]:event.target.value}))}>
                {item.options?.map(option=><option key={option} value={option}>{option}</option>)}
              </select>
            </span>)}
          </span>
        </div>}

        {itemsOf("회차").length>0&&<div className="prep-line">
          <span className="prep-tag is-change">바꿈</span>
          <span>회차 · 기수</span>
          <span className="prep-detail">
            {itemsOf("회차").map(item=><span key={item.id} className="prep-pair">
              <code>{item.text}</code> →
              <select value={values[item.id]??item.suggested}
                onChange={event=>setValues(prev=>({...prev,[item.id]:event.target.value}))}>
                {item.options?.map(option=><option key={option} value={option}>{option}</option>)}
              </select>
            </span>)}
          </span>
        </div>}

        {itemsOf("날짜").length>0&&<div className="prep-line">
          <span className="prep-tag is-clear">비움</span>
          <span>날짜 {itemsOf("날짜").length}곳</span>
          <span className="prep-detail help">해가 바뀌면 요일이 달라집니다. 비워 두면 작성하는 선생님이 학사일정을 보며 채웁니다.</span>
        </div>}

        {itemsOf("이름").length>0&&<div className="prep-line">
          <span className="prep-tag is-clear">비움</span>
          <span>담당자 이름 {itemsOf("이름").length}명</span>
          <span className="prep-detail help">{itemsOf("이름").map(item=>item.text).join(" · ")}</span>
        </div>}
      </div>

      <div className="action-buttons" style={{marginTop:18}}>
        <button className="btn btn-primary" disabled={busy} onClick={()=>void make()}>{busy?"처리 중...":`${year}학년도 양식 만들기`}</button>
        <button type="button" className="link-button" onClick={()=>setDetail(value=>!value)}>{detail?"자세히 닫기":"자세히 보고 하나씩 정하기"}</button>
      </div>

      {detail&&<div style={{marginTop:16,borderTop:"1px solid #e5e9f0",paddingTop:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:10}}>
          <span className="help">체크를 해제하면 그대로 둡니다. 날짜는 여기서 미리 정할 수도 있습니다.</span>
          <SchedulePopover year={Number(year)}/>
        </div>
        {GROUPS.filter(group=>group.kind==="날짜"||group.kind==="이름").map(group=>{
          const items=itemsOf(group.kind);
          if(!items.length)return null;
          return <section key={group.kind} style={{marginTop:12}}>
            <strong style={{fontSize:14}}>{group.title} ({items.length})</strong>
            <div className="fill-list" style={{marginTop:8}}>
              {items.map(item=>{
                const on=picked.has(item.id);
                const value=values[item.id]??"";
                return <div key={item.id} className={`fill-row${on?" is-on":""}`}>
                  <input type="checkbox" checked={on} onChange={()=>toggle(item.id)} aria-label={`${item.text} 비우기`}/>
                  {group.kind==="날짜"
                    ?<SourceDate schoolYear={analysis.sourceYear} text={item.text}/>
                    :<code className="fill-from">{item.text}</code>}
                  {item.count>1&&<em className="fill-count">{item.count}곳</em>}
                  <span aria-hidden>→</span>
                  {group.kind==="날짜"
                    ?<DatePicker schoolYear={Number(year)} value={value} disabled={!on}
                       placeholder="비움 (정하려면 달력)"
                       onChange={next=>setValues(prev=>({...prev,[item.id]:next}))}/>
                    :<input className="fill-input" type="text" value={value} disabled={!on}
                       placeholder="비움 (적으면 그 값으로)"
                       onChange={event=>setValues(prev=>({...prev,[item.id]:event.target.value}))}/>}
                </div>;
              })}
            </div>
          </section>;
        })}
      </div>}
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
