"use client";

import { useEffect,useMemo,useRef,useState } from "react";

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
const monthOf=(date:string)=>Number(date.slice(5,7));
/** 학년도는 3월에 시작해 다음 해 2월에 끝난다. */
const SCHOOL_MONTHS=[3,4,5,6,7,8,9,10,11,12,1,2];
const WEEK=["일","월","화","수","목","금","토"];

/** 그 달의 1일이 무슨 요일인지에 맞춰 빈 칸을 채운 달력 칸을 만든다. */
function buildCalendar(year:number,month:number){
  const first=new Date(year,month-1,1);
  const days=new Date(year,month,0).getDate();
  const cells:(number|null)[]=Array(first.getDay()).fill(null);
  for(let day=1;day<=days;day++)cells.push(day);
  while(cells.length%7!==0)cells.push(null);
  return cells;
}

/**
 * 학사일정을 옆에 띄워 실제 날짜와 요일을 보면서 고치게 한다.
 * 화면에 고정되어 스크롤해도 따라다니고, 바깥을 클릭하거나 Esc 를 누르면 닫힌다.
 */
export function SchedulePopover({year}:{year:number}){
  const [open,setOpen]=useState(false);
  const [events,setEvents]=useState<SchoolEvent[]|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [query,setQuery]=useState("");
  const [month,setMonth]=useState<number|null>(null);
  const [view,setView]=useState<"달력"|"목록">("달력");
  const box=useRef<HTMLDivElement>(null);
  const button=useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    if(!open)return;
    const onDown=(event:MouseEvent)=>{
      const target=event.target as Node;
      if(box.current?.contains(target)||button.current?.contains(target))return;
      setOpen(false);
    };
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
      // 오늘이 학년도 안이면 이번 달부터 보여 준다.
      const now=new Date();
      const current=now.getFullYear()===year||now.getFullYear()===year+1?now.getMonth()+1:null;
      setMonth(current&&(body.events as SchoolEvent[]).some(item=>monthOf(item.date)===current)?current:null);
    }catch(cause){setError(cause instanceof Error?cause.message:"학사일정을 불러오지 못했습니다.")}
    finally{setBusy(false)}
  }

  function toggle(){
    const next=!open;
    setOpen(next);
    if(next&&!events&&!busy)void load();
  }

  const months=useMemo(()=>{
    const has=new Set((events??[]).map(item=>monthOf(item.date)));
    return SCHOOL_MONTHS.filter(value=>has.has(value));
  },[events]);

  /** 달력 칸에 표시할, 날짜별 행사 모음 */
  const byDate=useMemo(()=>{
    const map=new Map<string,string[]>();
    for(const event of events??[]){
      const list=map.get(event.date);
      if(list)list.push(event.name);
      else map.set(event.date,[event.name]);
    }
    return map;
  },[events]);

  const groups=useMemo(()=>groupByDate(events??[]).filter(([date,entry])=>{
    if(month!==null&&monthOf(date)!==month)return false;
    if(!query)return true;
    return entry.names.some(name=>name.includes(query))||label(date).includes(query);
  }),[events,month,query]);

  return <>
    <button ref={button} type="button" className="btn btn-secondary" onClick={toggle}>
      {open?"학사일정 닫기":`${year}학년도 학사일정 보기`}
    </button>
    {open&&<div className="schedule-pop" ref={box}>
      <div className="schedule-pop-head">
        <strong>{year}학년도 학사일정</strong>
        <button type="button" className="schedule-close" onClick={()=>setOpen(false)} aria-label="닫기">×</button>
      </div>
      {busy&&<p className="help" style={{padding:"10px 12px"}}>불러오는 중...</p>}
      {error&&<div className="error" style={{margin:"10px 12px"}}>{error}</div>}
      {events&&!busy&&<>
        {months.length>0&&<div className="schedule-months">
          <button type="button" className={month===null?"is-on":""} onClick={()=>setMonth(null)}>전체</button>
          {months.map(value=><button key={value} type="button" className={month===value?"is-on":""} onClick={()=>setMonth(value)}>{value}월</button>)}
        </div>}
        <div className="schedule-views">
          <button type="button" className={view==="달력"?"is-on":""} onClick={()=>setView("달력")}>달력</button>
          <button type="button" className={view==="목록"?"is-on":""} onClick={()=>setView("목록")}>목록</button>
        </div>
        {view==="달력"&&month!==null&&(()=>{
          // 3~12월은 그해, 1~2월은 다음 해에 속한다.
          const calYear=month>=3?year:year+1;
          const cells=buildCalendar(calYear,month);
          const pad=(value:number)=>String(value).padStart(2,"0");
          return <div className="schedule-cal">
            <div className="cal-head">{WEEK.map((day,index)=><span key={day} className={index===0||index===6?"is-weekend":""}>{day}</span>)}</div>
            <div className="cal-grid">
              {cells.map((day,index)=>{
                if(day===null)return <span key={`empty-${index}`} className="cal-cell is-empty"/>;
                const key=`${calYear}-${pad(month)}-${pad(day)}`;
                const names=byDate.get(key);
                const weekend=index%7===0||index%7===6;
                return <span key={key} className={`cal-cell${weekend?" is-weekend":""}${names?" has-event":""}`} title={names?names.join(" · "):undefined}>
                  <b>{day}</b>
                  {names&&<i>{names[0]}{names.length>1?` 외 ${names.length-1}`:""}</i>}
                </span>;
              })}
            </div>
          </div>;
        })()}
        {view==="달력"&&month===null&&<p className="help" style={{padding:"8px 12px"}}>달력으로 보려면 위에서 달을 고르세요.</p>}
        {view==="목록"&&<>
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
      </>}
      <p className="help" style={{padding:"8px 12px",margin:0,borderTop:"1px solid #e5e9f0"}}>토·일요일은 빨간색입니다. 칸에 마우스를 올리면 그날 행사가 모두 보입니다.</p>
    </div>}
  </>;
}
