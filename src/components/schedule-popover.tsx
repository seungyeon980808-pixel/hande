"use client";

import { useEffect,useRef,useState } from "react";

type SchoolEvent={date:string;name:string;weekday:string};

/** 같은 날 여러 행사가 있으므로 날짜별로 묶는다. */
function groupByDate(events:SchoolEvent[]){
  const map=new Map<string,{weekday:string;names:string[]}>();
  for(const event of events){
    const entry=map.get(event.date);
    if(entry)entry.names.push(event.name);
    else map.set(event.date,{weekday:event.weekday,names:[event.name]});
  }
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
}

const label=(date:string)=>`${Number(date.slice(5,7))}월 ${Number(date.slice(8,10))}일`;

/**
 * 학사일정을 옆에 띄워 실제 날짜와 요일을 보면서 고치게 한다.
 * 바깥을 클릭하거나 Esc 를 누르면 닫힌다.
 */
export function SchedulePopover({year}:{year:number}){
  const [open,setOpen]=useState(false);
  const [events,setEvents]=useState<SchoolEvent[]|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [query,setQuery]=useState("");
  const box=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!open)return;
    const onDown=(event:MouseEvent)=>{if(box.current&&!box.current.contains(event.target as Node))setOpen(false)};
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("mousedown",onDown);
    window.addEventListener("keydown",onKey);
    return()=>{document.removeEventListener("mousedown",onDown);window.removeEventListener("keydown",onKey)};
  },[open]);

  async function load(){
    setBusy(true);setError("");
    try{
      const response=await fetch(`/api/schedule?from=${year}-03-01&to=${year+1}-02-28`);
      const body=await response.json();
      if(!response.ok)throw new Error(body.error);
      setEvents(body.events);
    }catch(cause){setError(cause instanceof Error?cause.message:"학사일정을 불러오지 못했습니다.")}
    finally{setBusy(false)}
  }

  function toggle(){
    const next=!open;
    setOpen(next);
    if(next&&!events&&!busy)void load();
  }

  const groups=groupByDate(events??[]).filter(([date,entry])=>
    !query||entry.names.some(name=>name.includes(query))||label(date).includes(query));

  return <div className="schedule-anchor" ref={box}>
    <button type="button" className="btn btn-secondary" onClick={toggle}>{open?"학사일정 닫기":`${year}학년도 학사일정 보기`}</button>
    {open&&<div className="schedule-pop">
      <div className="schedule-pop-head">
        <strong>{year}학년도 학사일정</strong>
        <button type="button" className="schedule-close" onClick={()=>setOpen(false)} aria-label="닫기">×</button>
      </div>
      {busy&&<p className="help" style={{padding:"10px 12px"}}>불러오는 중...</p>}
      {error&&<div className="error" style={{margin:"10px 12px"}}>{error}</div>}
      {events&&!busy&&<>
        <input className="schedule-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="행사 이름이나 날짜로 찾기"/>
        <div className="schedule-list">
          {groups.length===0
            ?<p className="help" style={{padding:"8px 4px"}}>{events.length?"찾는 일정이 없습니다.":"등록된 학사일정이 없습니다."}</p>
            :groups.map(([date,entry])=><div key={date} className="schedule-row">
              <span className={`schedule-date${entry.weekday==="토"||entry.weekday==="일"?" is-weekend":""}`}>
                {label(date)}({entry.weekday})
              </span>
              <span className="schedule-names">{entry.names.join(" · ")}</span>
            </div>)}
        </div>
      </>}
      <p className="help" style={{padding:"8px 12px",margin:0,borderTop:"1px solid #e5e9f0"}}>토·일요일은 빨간색입니다. 날짜를 정할 때 참고하세요.</p>
    </div>}
  </div>;
}
