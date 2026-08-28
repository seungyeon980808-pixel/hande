"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 관리 화면에서 취합을 수정·보관·삭제한다.
 * 관리 링크(URL의 토큰)가 곧 권한이므로 별도 인증은 없다.
 */
export function CollectionSettings({id,token,title,description,deadline,archived}:{
  id:string;token:string;title:string;description:string;deadline:string;archived:boolean;
}){
  const router=useRouter();
  const initial=new Date(deadline);
  const pad=(value:number)=>String(value).padStart(2,"0");
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({
    title,description,
    date:`${initial.getFullYear()}-${pad(initial.getMonth()+1)}-${pad(initial.getDate())}`,
    hour:pad(initial.getHours()),
  });
  const [busy,setBusy]=useState<""|"save"|"archive"|"delete">("");
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");

  async function patch(body:Record<string,unknown>,kind:"save"|"archive"){
    setBusy(kind);setError("");setStatus("");
    try{
      const response=await fetch(`/api/manage/${id}/${token}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error);
      router.refresh();
      setStatus(kind==="save"?"저장했습니다.":body.archived?"보관함으로 옮겼습니다. 제출 링크는 계속 동작합니다.":"보관을 해제했습니다.");
    }catch(cause){setError(cause instanceof Error?cause.message:"처리하지 못했습니다.")}
    finally{setBusy("")}
  }

  async function remove(){
    const first=window.confirm("이 취합을 완전히 삭제할까요?\n제출된 문서와 임시저장까지 모두 지워지며 되돌릴 수 없습니다.");
    if(!first)return;
    const second=window.prompt('정말 삭제하려면 "삭제" 라고 입력하세요.');
    if(second!=="삭제")return;
    setBusy("delete");setError("");
    try{
      const response=await fetch(`/api/manage/${id}/${token}`,{method:"DELETE"});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error);
      router.push("/");
    }catch(cause){setError(cause instanceof Error?cause.message:"삭제하지 못했습니다.");setBusy("")}
  }

  return <section className="card card-pad" style={{marginTop:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <div>
        <strong style={{fontSize:15}}>취합 설정</strong>
        <p className="help" style={{margin:"4px 0 0"}}>제목·안내·마감을 고치거나, 보관하거나, 삭제합니다.</p>
      </div>
      <div className="action-buttons">
        <button type="button" className="btn btn-secondary" disabled={!!busy}
          onClick={()=>void patch({archived:!archived},"archive")}>
          {busy==="archive"?"처리 중...":archived?"보관 해제":"보관하기"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={()=>setOpen(value=>!value)}>{open?"수정 닫기":"수정하기"}</button>
        <button type="button" className="btn btn-danger" disabled={!!busy} onClick={()=>void remove()}>
          {busy==="delete"?"삭제 중...":"삭제"}
        </button>
      </div>
    </div>
    {archived&&<div className="notice" style={{marginTop:10}}>보관된 취합입니다. 대시보드 기본 목록에는 보이지 않지만 제출·관리 링크는 그대로 동작합니다.</div>}
    {error&&<div className="error" style={{marginTop:10}}>{error}</div>}
    {status&&<div className="success" style={{marginTop:10}}>{status}</div>}

    {open&&<div className="form-grid" style={{marginTop:14}}>
      <div className="field full"><label htmlFor="edit-title">요청 제목</label>
        <input id="edit-title" value={form.title} minLength={2} maxLength={80}
          onChange={event=>setForm(prev=>({...prev,title:event.target.value}))}/></div>
      <div className="field full"><label htmlFor="edit-description">안내 내용</label>
        <textarea id="edit-description" rows={3} maxLength={500} value={form.description}
          onChange={event=>setForm(prev=>({...prev,description:event.target.value}))}/></div>
      <div className="field"><label>제출 마감</label>
        <div className="deadline-row">
          <input aria-label="마감 날짜" type="date" value={form.date}
            onChange={event=>setForm(prev=>({...prev,date:event.target.value}))}/>
          <select aria-label="마감 시간" value={form.hour}
            onChange={event=>setForm(prev=>({...prev,hour:event.target.value}))}>
            {Array.from({length:24},(_,hour)=>{const value=pad(hour);return <option key={value} value={value}>{hour<12?"오전":"오후"} {hour%12||12}시</option>})}
          </select>
        </div>
        <span className="help">마감은 정각 단위입니다. 마감을 미루면 제출 링크가 다시 열립니다.</span></div>
      <div className="field full action-buttons">
        <button type="button" className="btn btn-primary" disabled={!!busy}
          onClick={()=>void patch({title:form.title,description:form.description,deadline:`${form.date}T${form.hour}:00`},"save")}>
          {busy==="save"?"저장 중...":"변경 사항 저장"}
        </button>
      </div>
    </div>}
  </section>;
}
