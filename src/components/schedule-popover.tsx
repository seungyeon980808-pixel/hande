"use client";

import { useEffect,useMemo,useRef,useState } from "react";
import { eventsByDate,loadSchedule,MiniCalendar,SCHOOL_MONTHS,type SchoolEvent } from "./mini-calendar";

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
  // 편집 중인 문서를 가리면 창을 끌어서 옮길 수 있다.
  const [spot,setSpot]=useState<{x:number;y:number}|null>(null);
  const drag=useRef<{dx:number;dy:number}|null>(null);
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
      const loaded=await loadSchedule(year);
      setEvents(loaded);
      // 오늘이 학년도 안이면 이번 달부터 보여 준다.
      const now=new Date();
      const current=now.getFullYear()===year||now.getFullYear()===year+1?now.getMonth()+1:null;
      setMonth(current&&loaded.some(item=>monthOf(item.date)===current)?current:null);
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

  const byDate=useMemo(()=>eventsByDate(events??[]),[events]);

  const groups=useMemo(()=>groupByDate(events??[]).filter(([date,entry])=>{
    if(month!==null&&monthOf(date)!==month)return false;
    if(!query)return true;
    return entry.names.some(name=>name.includes(query))||label(date).includes(query);
  }),[events,month,query]);

  function startDrag(event:React.PointerEvent){
    const rect=box.current?.getBoundingClientRect();
    if(!rect)return;
    drag.current={dx:event.clientX-rect.left,dy:event.clientY-rect.top};
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  function onDrag(event:React.PointerEvent){
    if(!drag.current||!box.current)return;
    const width=box.current.offsetWidth,height=box.current.offsetHeight;
    // 창이 화면 밖으로 완전히 나가지 않도록 가둔다.
    const x=Math.min(Math.max(event.clientX-drag.current.dx,8),window.innerWidth-width-8);
    const y=Math.min(Math.max(event.clientY-drag.current.dy,8),window.innerHeight-Math.min(height,120)-8);
    setSpot({x,y});
  }
  function endDrag(event:React.PointerEvent){
    drag.current=null;
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  }

  return <>
    <button ref={button} type="button" className="btn btn-secondary" onClick={toggle}>
      {open?"학사일정 닫기":`${year}학년도 학사일정 보기`}
    </button>
    {open&&<div className="schedule-pop" ref={box}
      style={spot?{left:spot.x,top:spot.y,right:"auto"}:undefined}>
      <div className="schedule-pop-head is-drag" onPointerDown={startDrag} onPointerMove={onDrag} onPointerUp={endDrag}>
        <strong>{year}학년도 학사일정</strong>
        <span className="help drag-hint">끌어서 옮기기</span>
        <button type="button" className="schedule-close" onPointerDown={event=>event.stopPropagation()} onClick={()=>setOpen(false)} aria-label="닫기">×</button>
      </div>
      {busy&&<p className="help" style={{padding:"10px 12px"}}>불러오는 중...</p>}
      {error&&<div className="error" style={{margin:"10px 12px"}}>{error}</div>}
      {events&&!busy&&<>
        {view==="목록"&&months.length>0&&<div className="schedule-months">
          <button type="button" className={month===null?"is-on":""} onClick={()=>setMonth(null)}>전체</button>
          {months.map(value=><button key={value} type="button" className={month===value?"is-on":""} onClick={()=>setMonth(value)}>{value}월</button>)}
        </div>}
        <div className="schedule-views">
          <button type="button" className={view==="달력"?"is-on":""} onClick={()=>setView("달력")}>달력</button>
          <button type="button" className={view==="목록"?"is-on":""} onClick={()=>setView("목록")}>목록</button>
        </div>
        {view==="달력"&&<div className="schedule-cal">
          <MiniCalendar schoolYear={year} month={month??3} onMonth={setMonth} byDate={byDate}/>
        </div>}
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
