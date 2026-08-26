"use client";
/* 사용자 지정 원격 URL과 data URL을 모두 지원하므로 Next Image 허용 목록을 적용하지 않습니다. */
/* eslint-disable @next/next/no-img-element */

import { useEffect,useMemo,useState,type ChangeEvent,type FormEvent } from "react";
import { defaultTools,filterTools,normalizeToolUrl,parseStoredTools,toolCategories,toolTones,type TeacherTool,type ToolCategory,type ToolTone } from "@/lib/toolbox";

const storageKey="school-work-teacher-tools";
type ToolForm={name:string;detail:string;url:string;category:TeacherTool["category"];image:string;tone:ToolTone};
const emptyForm:ToolForm={name:"",detail:"",url:"",category:"수업",image:"",tone:"mint"};

export function Toolbox(){
  const [tools,setTools]=useState<TeacherTool[]>(defaultTools),[ready,setReady]=useState(false);
  const [query,setQuery]=useState(""),[category,setCategory]=useState<ToolCategory>("전체");
  const [editing,setEditing]=useState<string|null>(null),[modalOpen,setModalOpen]=useState(false),[menu,setMenu]=useState<string|null>(null);
  const [form,setForm]=useState<ToolForm>(emptyForm),[error,setError]=useState("");

  useEffect(()=>{queueMicrotask(()=>{setTools(parseStoredTools(localStorage.getItem(storageKey)));setReady(true)})},[]);
  useEffect(()=>{if(ready)localStorage.setItem(storageKey,JSON.stringify(tools))},[ready,tools]);
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setModalOpen(false);setMenu(null)}};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[]);

  const shown=useMemo(()=>filterTools(tools,query,category),[category,query,tools]);
  function openAdd(){setEditing(null);setForm({...emptyForm,tone:toolTones[tools.length%toolTones.length]});setError("");setMenu(null);setModalOpen(true)}
  function openEdit(tool:TeacherTool){setEditing(tool.id);setForm({name:tool.name,detail:tool.detail,url:tool.url,category:tool.category,image:tool.image??"",tone:tool.tone});setError("");setMenu(null);setModalOpen(true)}
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    try{
      const url=normalizeToolUrl(form.url);
      if(editing)setTools(current=>current.map(tool=>tool.id===editing?{...tool,...form,url}:tool));
      else setTools(current=>[...current,{...form,url,id:crypto.randomUUID()}]);
      setModalOpen(false);
    }catch(cause){setError(cause instanceof Error?cause.message:"주소를 확인해 주세요.")}
  }
  function remove(tool:TeacherTool){if(window.confirm(`‘${tool.name}’ 도구를 삭제할까요?`))setTools(current=>current.filter(item=>item.id!==tool.id));setMenu(null)}
  function upload(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];
    if(!file)return;
    if(file.size>1_500_000){setError("이미지는 1.5MB 이하로 올려 주세요.");return}
    const reader=new FileReader();
    reader.onload=()=>{setForm(current=>({...current,image:String(reader.result)}));setError("")};
    reader.readAsDataURL(file);
  }

  return <>
    <section className="toolbox-panel card">
      <div className="toolbox-toolbar">
        <label className="tool-search" htmlFor="tool-search"><span aria-hidden="true">⌕</span><input id="tool-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="도구 이름이나 설명 검색"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="검색어 지우기">×</button>}</label>
        <div className="tool-categories" aria-label="도구 카테고리">{toolCategories.map(item=><button type="button" key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="tool-grid">
        {shown.map(tool=><article className="tool-card" key={tool.id}>
          <a className="tool-main" href={tool.url} target="_blank" rel="noopener noreferrer" aria-label={`${tool.name} 새 창에서 열기`}>
            <div className={`tool-icon ${tool.tone}`}>{tool.image?<img src={tool.image} alt=""/>:<span>{tool.name.slice(0,1).toUpperCase()}</span>}</div>
            <div className="tool-copy"><small>{tool.category}</small><h2>{tool.name}</h2><p>{tool.detail||"바로가기"}</p></div><span className="tool-launch" aria-hidden="true">↗</span>
          </a>
          <button type="button" className="tool-more" onClick={()=>setMenu(menu===tool.id?null:tool.id)} aria-label={`${tool.name} 관리 메뉴`} aria-expanded={menu===tool.id}>•••</button>
          {menu===tool.id&&<div className="tool-menu"><button type="button" onClick={()=>openEdit(tool)}>수정</button><button type="button" className="danger" onClick={()=>remove(tool)}>삭제</button></div>}
        </article>)}
        <button type="button" className="tool-add-card" onClick={openAdd}><span>＋</span><strong>도구 추가하기</strong><small>자주 쓰는 사이트를 등록하세요</small></button>
      </div>
      {!shown.length&&<div className="tool-empty"><strong>찾는 도구가 없습니다.</strong><p>검색어나 카테고리를 바꿔 보세요.</p></div>}
      <p className="tool-save-note">추가한 도구는 이 브라우저에 자동으로 저장됩니다.</p>
    </section>
    {modalOpen&&<div className="tool-modal-layer"><button type="button" className="tool-modal-scrim" onClick={()=>setModalOpen(false)} aria-label="도구 입력 창 닫기"/><section className="tool-modal" role="dialog" aria-modal="true" aria-labelledby="tool-modal-title">
      <div className="tool-modal-head"><div><span>바로가기 설정</span><h2 id="tool-modal-title">{editing?"도구 수정":"새 도구 추가"}</h2></div><button type="button" onClick={()=>setModalOpen(false)} aria-label="닫기">×</button></div>
      <form onSubmit={submit}>
        <div className="field"><label htmlFor="tool-name">도구 이름</label><input id="tool-name" required maxLength={60} value={form.name} onChange={event=>setForm({...form,name:event.target.value})} placeholder="예: 구글 클래스룸"/></div>
        <div className="field"><label htmlFor="tool-url">링크 주소</label><input id="tool-url" required inputMode="url" value={form.url} onChange={event=>setForm({...form,url:event.target.value})} placeholder="https://example.com"/></div>
        <div className="tool-form-row"><div className="field"><label htmlFor="tool-category">카테고리</label><select id="tool-category" value={form.category} onChange={event=>setForm({...form,category:event.target.value as TeacherTool["category"]})}>{toolCategories.slice(1).map(item=><option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="tool-detail">설명 <em>선택</em></label><input id="tool-detail" maxLength={100} value={form.detail} onChange={event=>setForm({...form,detail:event.target.value})} placeholder="어떤 도구인가요?"/></div></div>
        <fieldset><legend>버튼 이미지 <em>선택</em></legend><div className="tool-image-options"><label className="tool-upload"><input type="file" accept="image/*" onChange={upload}/><span>{form.image?"이미지 바꾸기":"내 이미지 업로드"}</span></label><span>또는</span><input aria-label="이미지 URL" value={form.image.startsWith("data:")?"":form.image} onChange={event=>setForm({...form,image:event.target.value})} placeholder="이미지 URL 붙여넣기"/></div>{form.image&&<div className="tool-image-preview"><img src={form.image} alt="도구 이미지 미리보기"/><button type="button" onClick={()=>setForm({...form,image:""})}>이미지 지우기</button></div>}</fieldset>
        <fieldset><legend>버튼 색상</legend><div className="tool-tone-picker">{toolTones.map(tone=><button type="button" key={tone} className={`${tone} ${form.tone===tone?"selected":""}`} onClick={()=>setForm({...form,tone})} aria-label={`${tone} 색상`}/>)}</div></fieldset>
        {error&&<div className="error">{error}</div>}
        <div className="tool-form-actions"><button type="button" className="btn btn-secondary" onClick={()=>setModalOpen(false)}>취소</button><button type="submit" className="btn btn-primary">{editing?"수정 완료":"툴박스에 추가"}</button></div>
      </form>
    </section></div>}
  </>
}
