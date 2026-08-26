"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import type { TimetableEntry,TimetableResult } from "@/lib/neis-data";

type TimetableResponse=TimetableResult&{fetchedAt:string};

const todayInSeoul=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const koreanDate=(date:string)=>new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"long",day:"numeric",weekday:"long"}).format(new Date(`${date}T12:00:00+09:00`));
const loadedDate=(date:string|null)=>date&&/^\d{8}$/.test(date)?`${date.slice(0,4)}.${date.slice(4,6)}.${date.slice(6,8)}`:"확인되지 않음";
const moveDate=(date:string,days:number)=>{const value=new Date(`${date}T12:00:00+09:00`);value.setUTCDate(value.getUTCDate()+days);return value.toISOString().slice(0,10)};

export function TimetableView(){
  const [date,setDate]=useState(todayInSeoul),[grade,setGrade]=useState("1"),[className,setClassName]=useState("1");
  const [result,setResult]=useState<TimetableResponse|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
  const requestId=useRef(0);

  const load=useCallback(async()=>{
    const currentRequest=++requestId.current;
    setLoading(true);setError("");setResult(null);
    try{
      const params=new URLSearchParams({date,grade,className}),response=await fetch(`/api/timetable?${params}`,{cache:"no-store"});
      const body=await response.json() as TimetableResponse|{error?:string};
      if(!response.ok)throw new Error("error" in body&&body.error?body.error:"시간표를 불러오지 못했습니다.");
      if(currentRequest===requestId.current)setResult(body as TimetableResponse);
    }catch(cause){if(currentRequest===requestId.current)setError(cause instanceof Error?cause.message:"시간표를 불러오지 못했습니다.")}
    finally{if(currentRequest===requestId.current)setLoading(false)}
  },[className,date,grade]);

  useEffect(()=>{queueMicrotask(()=>void load());const timer=window.setInterval(()=>void load(),300_000);return()=>window.clearInterval(timer)},[load]);

  const entries=result?.entries??[];
  return <div className="timetable-layout">
    <section className="card timetable-controls" aria-label="시간표 조회 조건">
      <div className="timetable-date-nav">
        <button type="button" onClick={()=>setDate(current=>moveDate(current,-1))} aria-label="이전 날짜">‹</button>
        <label><span>조회 날짜</span><input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label>
        <button type="button" onClick={()=>setDate(current=>moveDate(current,1))} aria-label="다음 날짜">›</button>
        <button className="timetable-today" type="button" onClick={()=>setDate(todayInSeoul())}>오늘</button>
      </div>
      <div className="timetable-class-select">
        <label><span>학년</span><select value={grade} onChange={event=>setGrade(event.target.value)}>{[1,2,3].map(value=><option key={value} value={value}>{value}학년</option>)}</select></label>
        <label><span>반</span><select value={className} onChange={event=>setClassName(event.target.value)}>{Array.from({length:20},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}반</option>)}</select></label>
        <button className="btn btn-secondary" type="button" onClick={()=>void load()} disabled={loading}>{loading?"조회 중…":"새로고침"}</button>
      </div>
    </section>

    <section className="card timetable-panel" aria-live="polite" aria-busy={loading}>
      <div className="timetable-summary">
        <div><span>{koreanDate(date)}</span><h2>{grade}학년 {className}반 시간표</h2></div>
        <div className="timetable-sync"><span>나이스 적재일 {loadedDate(result?.loadedAt??null)}</span><small>5분마다 자동으로 확인합니다.</small></div>
      </div>
      {error&&<div className="error timetable-message">{error}</div>}
      {!error&&loading&&!result&&<div className="timetable-empty"><strong>나이스 시간표를 불러오는 중입니다.</strong><p>잠시만 기다려 주세요.</p></div>}
      {!error&&!loading&&!entries.length&&<div className="timetable-empty"><strong>등록된 시간표가 없습니다.</strong><p>주말·방학이거나 아직 나이스에 시간표가 적재되지 않았을 수 있습니다.</p></div>}
      {!!entries.length&&<ol className={`timetable-list ${loading?"is-refreshing":""}`}>{entries.map(entry=><TimetablePeriod key={`${entry.date}-${entry.period}`} entry={entry}/>)}</ol>}
      {result&&<p className="timetable-fetched">우리 서버 확인 시각 {new Date(result.fetchedAt).toLocaleString("ko-KR",{timeZone:"Asia/Seoul"})}</p>}
    </section>
    <p className="timetable-note">나이스 교육정보 개방 API의 최신 적재본입니다. 당일 변경 사항은 학교의 나이스 반영 시점에 따라 늦게 표시될 수 있습니다.</p>
  </div>;
}

function TimetablePeriod({entry}:{entry:TimetableEntry}){return <li><span className="timetable-period">{entry.period}<small>교시</small></span><strong>{entry.subject}</strong></li>}
