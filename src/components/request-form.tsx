"use client";

import { useState } from "react";
import type { CollectionType,Teacher } from "@/lib/domain";
import { TableSchemaBuilder } from "./table-schema-builder";
import { FileDrop } from "./file-drop";
import { takeHandoff } from "@/lib/handoff";
import { DEFAULT_TARGET_YEAR } from "@/lib/school-year";

type Created={shareUrl:string;manageUrl:string};

export function RequestForm({teachers}:{teachers:Teacher[]}){
  const [type,setType]=useState<CollectionType>("document"),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [created,setCreated]=useState<Created|null>(null);
  // 빈 양식 만들기 화면에서 넘어온 파일이 있으면 그대로 채워 둔다.
  // 처음 렌더될 때 한 번만 꺼내고, 꺼낸 뒤에는 보관분이 지워진다.
  const [handoff]=useState(()=>typeof window==="undefined"?null:takeHandoff());
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/collections",{method:"POST",body:new FormData(event.currentTarget)});const body=await response.json();if(!response.ok)throw new Error(body.error);setCreated(body)}catch(cause){setError(cause instanceof Error?cause.message:"요청을 만들지 못했습니다.")}finally{setBusy(false)}}
  if(created)return <section className="card card-pad"><div className="success"><strong>취합 요청이 만들어졌습니다.</strong><br/>아래 제출 링크 하나를 대상 교사 모두에게 보내면 됩니다.</div><div className="form-grid" style={{marginTop:20}}><CopyField label="교사용 제출 링크" value={created.shareUrl}/><CopyField label="담당자 관리 링크 (외부 전달 금지)" value={created.manageUrl}/></div><p className="help" style={{marginTop:18}}>관리 링크는 비밀번호와 같은 역할을 합니다. 시연본에서는 분실 시 복구할 수 없습니다.</p></section>;
  return <form onSubmit={submit} className="card card-pad form-grid">
    {handoff&&<div className="success" style={{gridColumn:"1/-1"}}><strong>파일 2개가 이미 채워져 있습니다.</strong> 올해 양식 만들기에서 넘어왔습니다. 아래 초록 표시가 붙은 칸은 다시 올리지 않아도 됩니다. <strong>제목과 마감일만</strong> 정하면 됩니다.</div>}
    <div className="field full"><label>취합 유형</label><input type="hidden" name="type" value={type}/><div className="type-tabs"><TypeButton active={type==="document"} onClick={()=>setType("document")} title="한글 문서 취합" detail="HWP/HWPX를 브라우저에서 작성"/><TypeButton active={type!=="document"} onClick={()=>setType(type==="document"?"table":type)} title="엑셀 취합" detail="웹 표 또는 XLSX 파일로 제출"/></div>{type!=="document"&&<div className="subtype-row"><button type="button" className={type==="table"?"active":""} onClick={()=>setType("table")}>웹 표로 입력</button><button type="button" className={type==="xlsx"?"active":""} onClick={()=>setType("xlsx")}>엑셀 파일로 제출</button></div>}</div>
    <div className="field full"><label htmlFor="title">요청 제목</label><input id="title" name="title" required minLength={2} maxLength={80} placeholder="예: 2026학년도 부서별 운영계획 취합"/></div>
    <div className="field full"><label htmlFor="description">안내 내용</label><textarea id="description" name="description" rows={3} maxLength={500} placeholder="작성 범위나 유의사항을 간단히 적어주세요."/></div>
    <div className="field"><label htmlFor="targetYear">기준 학년도</label><input id="targetYear" name="targetYear" required type="number" min={2000} max={2099} defaultValue={DEFAULT_TARGET_YEAR}/><span className="help">몇 학년도용 문서인지 정합니다. AI 검토가 이 값을 기준으로 바꿀 곳을 찾습니다.</span></div>
    <div className="field"><label htmlFor="deadline">제출 마감</label><input id="deadline" name="deadline" required type="datetime-local"/></div>
    {type!=="table"&&<div className="field"><label>{type==="document"?"작성 양식":"엑셀 양식"}</label><FileDrop key={type} name="template" required accept={type==="document"?".hwp,.hwpx":".xlsx"} hint={type==="document"?"HWP · HWPX":"XLSX"} initial={handoff?.template} badge="앞 화면에서 넘어온 양식"/><span className="help">{type==="document"?'HWP/HWPX, 최대 20MB · HWPX에서 {{교사명}}, {{부서명}} 자동 치환':"XLSX, 최대 20MB · 내려받아 Excel에서 작성 후 제출"}</span></div>}
    {type==="document"&&<div className="field"><label>작년 자료 (선택)</label><FileDrop name="reference" accept=".hwp,.hwpx" hint="작년 완성본" initial={handoff?.reference??undefined} badge="앞 화면에서 넘어온 작년 자료"/><span className="help">함께 올리면 제출 화면에서 작년 문서를 왼쪽에 나란히 띄워 복사·붙여넣기 할 수 있습니다.</span></div>}
    {type==="table"&&<TableSchemaBuilder/>}
    <div className="field full"><label>제출 대상</label><div className="teacher-grid">{teachers.map(teacher=><label className="teacher-check" key={teacher.id}><input type="checkbox" name="recipientIds" value={teacher.id}/><span><strong>{teacher.name}</strong><br/><span className="help">{teacher.department}</span></span></label>)}</div></div>
    {error&&<div className="error field full">{error}</div>}
    <div className="field full" style={{alignItems:"flex-end"}}><button disabled={busy} className="btn btn-primary" type="submit">{busy?"요청 만드는 중...":"요청하기 및 링크 생성"}</button></div>
  </form>;
}

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
