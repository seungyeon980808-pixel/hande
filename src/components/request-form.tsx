"use client";

import { useEffect,useMemo,useRef,useState } from "react";
import type { CollectionMode,CollectionType,Teacher } from "@/lib/domain";
import { TableSchemaBuilder } from "./table-schema-builder";
import { FileDrop } from "./file-drop";
import { takeHandoff } from "@/lib/handoff";
import { DEFAULT_TARGET_YEAR } from "@/lib/school-year";
import { SharedFieldBuilder } from "./shared-field-builder";

type Created={shareUrl:string;manageUrl:string;warnings?:string[]};

function initialDeadline(){
  const date=new Date(Date.now()+7*24*60*60*1000);
  const year=date.getFullYear(),month=String(date.getMonth()+1).padStart(2,"0"),day=String(date.getDate()).padStart(2,"0");
  return {date:`${year}-${month}-${day}`,hour:String(date.getHours()).padStart(2,"0")};
}

export function RequestForm({teachers}:{teachers:Teacher[]}){
  // 빈 양식 만들기 화면에서 넘어온 파일이 있으면 그대로 채워 둔다.
  // 처음 렌더될 때 한 번만 꺼내고, 꺼낸 뒤에는 보관분이 지워진다.
  const [handoff]=useState(()=>typeof window==="undefined"?null:takeHandoff());
  const initial=useMemo(()=>initialDeadline(),[]);
  const [type,setType]=useState<CollectionType>("document"),[mode,setMode]=useState<CollectionMode>("individual"),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [created,setCreated]=useState<Created|null>(null),[deadlineDate,setDeadlineDate]=useState(initial.date),[deadlineHour,setDeadlineHour]=useState(initial.hour);
  const [selectedIds,setSelectedIds]=useState<Set<string>>(new Set()),[openDepartments,setOpenDepartments]=useState<Set<string>>(new Set());
  const departments=useMemo(()=>Array.from(new Map(teachers.map(teacher=>[teacher.department,[] as Teacher[]])).entries()).map(([name])=>({name,members:teachers.filter(teacher=>teacher.department===name)})),[teachers]);
  const selectedTeachers=teachers.filter(teacher=>selectedIds.has(teacher.id));

  function togglePerson(id:string){setSelectedIds(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next})}
  function toggleDepartment(members:Teacher[]){setSelectedIds(current=>{const next=new Set(current),all=members.every(member=>next.has(member.id));members.forEach(member=>all?next.delete(member.id):next.add(member.id));return next})}
  function toggleOpen(name:string){setOpenDepartments(current=>{const next=new Set(current);if(next.has(name))next.delete(name);else next.add(name);return next})}
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/collections",{method:"POST",body:new FormData(event.currentTarget)});const body=await response.json();if(!response.ok)throw new Error(body.error);setCreated(body)}catch(cause){setError(cause instanceof Error?cause.message:"요청을 만들지 못했습니다.")}finally{setBusy(false)}}
  if(created)return <section className="card card-pad"><div className="success"><strong>취합 요청이 만들어졌습니다.</strong><br/>아래 제출 링크 하나를 대상 교사 모두에게 보내면 됩니다.</div>{created.warnings?.map(warning=><div className="notice" style={{marginTop:10}} key={warning}>{warning}</div>)}<div className="form-grid" style={{marginTop:20}}><CopyField label="교사용 제출 링크" value={created.shareUrl}/><CopyField label="담당자 관리 링크 (외부 전달 금지)" value={created.manageUrl}/></div><p className="help" style={{marginTop:18}}>관리 링크는 비밀번호와 같은 역할을 합니다. 시연본에서는 분실 시 복구할 수 없습니다.</p></section>;
  return <form onSubmit={submit} className="card card-pad form-grid">
    {handoff&&<div className="success" style={{gridColumn:"1/-1"}}><strong>파일 2개가 이미 채워져 있습니다.</strong> 올해 양식 만들기에서 넘어왔습니다. 아래 초록 표시가 붙은 칸은 다시 올리지 않아도 됩니다. <strong>제목과 마감일만</strong> 정하면 됩니다.</div>}
    <div className="field full"><label>취합 유형</label><input type="hidden" name="type" value={type}/><input type="hidden" name="mode" value={type==="document"?mode:"individual"}/><div className="type-tabs"><TypeButton active={type==="document"} onClick={()=>setType("document")} title="한글 문서 취합" detail="사람별 제출 또는 지정 필드 공동작성"/><TypeButton active={type!=="document"} onClick={()=>setType(type==="document"?"table":type)} title="엑셀 취합" detail="웹 표 또는 XLSX 파일로 제출"/></div>{type==="document"&&<div className="subtype-row"><button type="button" className={mode==="individual"?"active":""} onClick={()=>setMode("individual")}>사람별 문서 제출</button><button type="button" className={mode==="shared_fields"?"active":""} onClick={()=>setMode("shared_fields")}>지정 필드 공동작성</button></div>}{type!=="document"&&<div className="subtype-row"><button type="button" className={type==="table"?"active":""} onClick={()=>setType("table")}>웹 표로 입력</button><button type="button" className={type==="xlsx"?"active":""} onClick={()=>setType("xlsx")}>엑셀 파일로 제출</button></div>}</div>
    <div className="field full"><label htmlFor="title">요청 제목</label><input id="title" name="title" required minLength={2} maxLength={80} placeholder="예: 2026학년도 부서별 운영계획 취합"/></div>
    <div className="field full"><label htmlFor="description">안내 내용</label><textarea id="description" name="description" rows={3} maxLength={500} placeholder="작성 범위나 유의사항을 간단히 적어주세요."/></div>
    <div className="field full"><label htmlFor="targetYear">기준 학년도</label><input id="targetYear" name="targetYear" required type="number" min={2000} max={2099} defaultValue={DEFAULT_TARGET_YEAR}/><span className="help">몇 학년도용 문서인지 정합니다. AI 검토가 이 값을 기준으로 바꿀 곳을 찾습니다.</span></div>
    <div className="field full"><label>제출 마감</label><input type="hidden" name="deadline" value={`${deadlineDate}T${deadlineHour}:00`}/><div className="deadline-row"><input aria-label="마감 날짜" required type="date" value={deadlineDate} onChange={event=>setDeadlineDate(event.target.value)}/><select aria-label="마감 시간" value={deadlineHour} onChange={event=>setDeadlineHour(event.target.value)}>{Array.from({length:24},(_,hour)=>{const value=String(hour).padStart(2,"0");return <option key={value} value={value}>{hour<12?"오전":"오후"} {hour%12||12}시</option>})}</select></div><span className="help">기본값은 지금부터 일주일 뒤 같은 시간대이며, 마감은 정각 단위로 지정합니다.</span></div>
    <div className="field full recipient-picker"><div className="recipient-head"><div><label>제출 대상</label><span className="help">먼저 제출 대상을 정하세요. 선택한 사람만 문서 배정 패널에 표시됩니다.</span></div><strong>{selectedIds.size}명 선택</strong></div>{selectedTeachers.map(teacher=><input key={teacher.id} type="hidden" name="recipientIds" value={teacher.id}/>)}<div className="recipient-actions"><label className="inline-check"><input type="checkbox" checked={selectedIds.size===teachers.length} onChange={()=>setSelectedIds(selectedIds.size===teachers.length?new Set():new Set(teachers.map(teacher=>teacher.id)))}/> 전체 선택</label>{selectedIds.size>0&&<button type="button" className="text-button" onClick={()=>setSelectedIds(new Set())}>전체 해제</button>}</div><div className="department-list">{departments.map(department=>{const count=department.members.filter(member=>selectedIds.has(member.id)).length,open=openDepartments.has(department.name);return <section className="department" key={department.name}><div className="department-row"><button className="department-toggle" type="button" aria-expanded={open} onClick={()=>toggleOpen(department.name)}><span>{open?"▾":"▸"}</span><strong>{department.name}</strong></button><label className="department-select"><TriStateCheckbox checked={count===department.members.length} mixed={count>0&&count<department.members.length} onChange={()=>toggleDepartment(department.members)}/><span>{count}/{department.members.length}명</span></label></div>{open&&<div className="department-members">{department.members.map(member=><label className="member-check" key={member.id}><input type="checkbox" checked={selectedIds.has(member.id)} onChange={()=>togglePerson(member.id)}/><span>{member.name}</span></label>)}</div>}</section>})}</div></div>
    {type==="document"&&mode==="shared_fields"?<SharedFieldBuilder teachers={selectedTeachers}/>:type!=="table"&&<div className="field full"><label>{type==="document"?"작성 양식":"엑셀 양식"}</label><FileDrop key={`${type}-${mode}`} name="template" required accept={type==="document"?".hwp,.hwpx":".xlsx"} hint={type==="document"?"HWP · HWPX":"XLSX"} initial={handoff?.template} badge="앞 화면에서 넘어온 양식"/><span className="help">{type==="document"?'HWP/HWPX, 최대 20MB · HWPX에서 {{교사명}}, {{부서명}} 자동 치환':"XLSX, 최대 20MB · 내려받아 Excel에서 작성 후 제출"}</span></div>}
    {type==="document"&&<div className="field full"><label>작년 자료 (선택)</label><FileDrop name="reference" accept=".hwp,.hwpx" hint="작년 완성본" initial={handoff?.reference??undefined} badge="앞 화면에서 넘어온 작년 자료"/><span className="help">함께 올리면 제출 화면에서 작년 문서를 왼쪽에 나란히 띄워 보면서 작성할 수 있습니다.</span></div>}
    {type==="table"&&<TableSchemaBuilder/>}
    {error&&<div className="error field full">{error}</div>}
    <div className="field full" style={{alignItems:"flex-end"}}><button disabled={busy} className="btn btn-primary" type="submit">{busy?"요청 만드는 중...":"요청하기 및 링크 생성"}</button></div>
  </form>;
}

function TriStateCheckbox({checked,mixed,onChange}:{checked:boolean;mixed:boolean;onChange:()=>void}){const ref=useRef<HTMLInputElement>(null);useEffect(()=>{if(ref.current)ref.current.indeterminate=mixed},[mixed]);return <input ref={ref} type="checkbox" checked={checked} onChange={onChange}/>}
function TypeButton({active,onClick,title,detail}:{active:boolean;onClick:()=>void;title:string;detail:string}){return <button type="button" className={`type-card ${active?"active":""}`} onClick={onClick}><strong>{title}</strong><span>{detail}</span></button>}
/**
 * 링크를 복사하고, 복사한 뒤에는 바로 새 탭에서 열 수 있게 한다.
 * 복사 다음에 하는 일이 대개 "열어서 확인" 이기 때문이다.
 */
function CopyField({label,value}:{label:string;value:string}){
  const [copied,setCopied]=useState(false);
  const [failed,setFailed]=useState(false);
  async function copy(){
    try{
      await navigator.clipboard.writeText(value);
      setCopied(true);setFailed(false);
    }catch{
      // 보안 설정에 따라 복사가 막힐 수 있다. 그때는 직접 고르도록 알린다.
      setFailed(true);
    }
  }
  return <div className="field">
    <label>{label}</label>
    <div style={{display:"flex",gap:8}}>
      <input readOnly value={value} onFocus={event=>event.currentTarget.select()}/>
      {copied
        ?<a className="btn btn-primary" href={value} target="_blank" rel="noreferrer"
           style={{whiteSpace:"nowrap"}}>새 탭에서 열기</a>
        :<button type="button" className="btn btn-secondary" onClick={()=>void copy()} style={{whiteSpace:"nowrap"}}>복사</button>}
    </div>
    {copied&&<span className="help">링크를 복사했습니다. 눌러서 바로 열어 볼 수 있습니다.</span>}
    {failed&&<span className="help">복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.</span>}
  </div>;
}
