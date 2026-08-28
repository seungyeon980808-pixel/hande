"use client";

import { useEffect,useMemo,useRef,useState } from "react";

export type SchoolEvent={date:string;name:string;weekday:string};

const WEEK=["일","월","화","수","목","금","토"];
/** 학년도는 3월에 시작해 다음 해 2월에 끝난다. */
export const SCHOOL_MONTHS=[3,4,5,6,7,8,9,10,11,12,1,2];
const pad=(value:number)=>String(value).padStart(2,"0");

/** 3~12월은 그해, 1~2월은 다음 해에 속한다. */
export const yearOfMonth=(schoolYear:number,month:number)=>month>=3?schoolYear:schoolYear+1;

/** 그 달의 1일이 무슨 요일인지에 맞춰 빈 칸을 채운 달력 칸을 만든다. */
export function buildCalendar(year:number,month:number){
  const first=new Date(year,month-1,1);
  const days=new Date(year,month,0).getDate();
  const cells:(number|null)[]=Array(first.getDay()).fill(null);
  for(let day=1;day<=days;day++)cells.push(day);
  while(cells.length%7!==0)cells.push(null);
  return cells;
}

/** 학사일정을 날짜별로 묶어 달력 칸에 붙일 수 있게 한다. */
export function eventsByDate(events:SchoolEvent[]){
  const map=new Map<string,string[]>();
  for(const event of events){
    const list=map.get(event.date);
    if(list)list.push(event.name);
    else map.set(event.date,[event.name]);
  }
  return map;
}

/** 학사일정을 한 번만 불러와 여러 곳에서 함께 쓴다. */
let cache:{year:number;events:SchoolEvent[]}|null=null;
export async function loadSchedule(year:number){
  if(cache?.year===year)return cache.events;
  const response=await fetch(`/api/schedule?from=${year}-03-01&to=${year+1}-02-28`);
  const body=await response.json();
  if(!response.ok)throw new Error(body.error);
  cache={year,events:body.events};
  return cache.events;
}

/**
 * 달 하나를 보여 주는 작은 달력. 날짜를 누르면 그 값을 돌려준다.
 * 학사일정이 있는 날은 표시해 두어 시험·행사와 겹치지 않게 고를 수 있다.
 */
export function MiniCalendar({schoolYear,month,onMonth,byDate,onPick,selected}:{
  schoolYear:number;month:number;onMonth:(month:number)=>void;
  byDate:Map<string,string[]>;onPick?:(text:string)=>void;selected?:string;
}){
  const year=yearOfMonth(schoolYear,month);
  const cells=useMemo(()=>buildCalendar(year,month),[year,month]);
  return <div className="mini-cal">
    <div className="mini-cal-months">
      {SCHOOL_MONTHS.map(value=><button key={value} type="button"
        className={month===value?"is-on":""} onClick={()=>onMonth(value)}>{value}월</button>)}
    </div>
    <div className="cal-head">{WEEK.map((day,index)=><span key={day} className={index===0||index===6?"is-weekend":""}>{day}</span>)}</div>
    <div className="cal-grid">
      {cells.map((day,index)=>{
        if(day===null)return <span key={`empty-${index}`} className="cal-cell is-empty"/>;
        const key=`${year}-${pad(month)}-${pad(day)}`;
        const names=byDate.get(key);
        const weekend=index%7===0||index%7===6;
        const text=`${month}월 ${day}일(${WEEK[index%7]})`;
        const className=`cal-cell${weekend?" is-weekend":""}${names?" has-event":""}${selected===text?" is-picked":""}`;
        if(!onPick)return <span key={key} className={className} title={names?names.join(" · "):undefined}>
          <b>{day}</b>{names&&<i>{names[0]}{names.length>1?` 외 ${names.length-1}`:""}</i>}
        </span>;
        return <button key={key} type="button" className={className} title={names?names.join(" · "):undefined}
          onClick={()=>onPick(text)}>
          <b>{day}</b>{names&&<i>{names[0]}{names.length>1?` 외 ${names.length-1}`:""}</i>}
        </button>;
      })}
    </div>
  </div>;
}

/** 입력칸 옆에서 달력을 열어 날짜를 고르게 한다. */
export function DatePicker({schoolYear,value,onChange,placeholder,disabled}:{
  schoolYear:number;value:string;onChange:(value:string)=>void;placeholder?:string;disabled?:boolean;
}){
  const [open,setOpen]=useState(false);
  const [events,setEvents]=useState<SchoolEvent[]>([]);
  const [month,setMonth]=useState(3);
  const [error,setError]=useState("");
  const box=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!open)return;
    const onDown=(event:MouseEvent)=>{if(box.current&&!box.current.contains(event.target as Node))setOpen(false)};
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("mousedown",onDown);
    window.addEventListener("keydown",onKey);
    return()=>{document.removeEventListener("mousedown",onDown);window.removeEventListener("keydown",onKey)};
  },[open]);

  async function toggle(){
    const next=!open;
    setOpen(next);
    if(!next)return;
    // 지금 적힌 값이나 원래 날짜의 달을 먼저 보여 준다.
    const found=/(\d{1,2})\s?[월/.]/.exec(value);
    if(found)setMonth(Number(found[1]));
    if(!events.length){
      try{setEvents(await loadSchedule(schoolYear))}
      catch(cause){setError(cause instanceof Error?cause.message:"학사일정을 불러오지 못했습니다.")}
    }
  }

  const byDate=useMemo(()=>eventsByDate(events),[events]);

  return <span className="date-picker" ref={box}>
    <input className="fill-input" type="text" value={value} disabled={disabled} placeholder={placeholder}
      onChange={event=>onChange(event.target.value)}/>
    <button type="button" className="date-picker-open" disabled={disabled} onClick={()=>void toggle()} aria-label="달력에서 고르기">📅</button>
    {open&&<div className="date-picker-pop">
      {error
        ?<div className="error" style={{margin:8}}>{error}</div>
        :<MiniCalendar schoolYear={schoolYear} month={month} onMonth={setMonth} byDate={byDate} selected={value}
           onPick={text=>{onChange(text);setOpen(false)}}/>}
      <div className="date-picker-foot">
        <button type="button" className="link-button" onClick={()=>{onChange("");setOpen(false)}}>비우기</button>
        <span className="help">색이 있는 날은 학사일정이 있습니다</span>
      </div>
    </div>}
  </span>;
}

/**
 * 작년 원본 날짜를 보여 주고, 눌러서 그해 달력으로 확인만 하게 한다.
 * 고르는 기능은 없다. 작년 기준이라는 것을 알리는 이름표가 함께 붙는다.
 */
export function SourceDate({schoolYear,text}:{schoolYear:number;text:string}){
  const [open,setOpen]=useState(false);
  const [events,setEvents]=useState<SchoolEvent[]>([]);
  const [month,setMonth]=useState(3);
  const box=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!open)return;
    const onDown=(event:MouseEvent)=>{if(box.current&&!box.current.contains(event.target as Node))setOpen(false)};
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("mousedown",onDown);
    window.addEventListener("keydown",onKey);
    return()=>{document.removeEventListener("mousedown",onDown);window.removeEventListener("keydown",onKey)};
  },[open]);

  async function toggle(){
    const next=!open;
    setOpen(next);
    if(!next)return;
    const found=/(\d{1,2})\s?[월/.]/.exec(text);
    if(found)setMonth(Number(found[1]));
    // 작년 학사일정이 없을 수도 있다. 없으면 요일만 보여 준다.
    if(!events.length){try{setEvents(await loadSchedule(schoolYear))}catch{setEvents([])}}
  }

  const byDate=useMemo(()=>eventsByDate(events),[events]);

  return <span className="source-date" ref={box}>
    <span className="source-tag">{schoolYear} 작년</span>
    <button type="button" className="source-text" onClick={()=>void toggle()}
      title={`${schoolYear}학년도 달력에서 확인`}>{text}</button>
    {open&&<div className="date-picker-pop">
      <p className="help" style={{margin:"0 0 6px"}}><strong>{schoolYear}학년도</strong> 달력입니다. 확인만 하는 곳이며 고를 수 없습니다.</p>
      <MiniCalendar schoolYear={schoolYear} month={month} onMonth={setMonth} byDate={byDate}/>
    </div>}
  </span>;
}
