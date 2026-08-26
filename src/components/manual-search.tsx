"use client";

import { useMemo,useState } from "react";
import { filterManuals,type Manual } from "@/lib/manuals";

export function ManualSearch({manuals}:{manuals:Manual[]}){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("전체");
  const categories=["전체",...Array.from(new Set(manuals.map(m=>m.category)))];
  const results=useMemo(()=>filterManuals(manuals,query,category),[category,manuals,query]);
  return <div className="manual-layout"><section className="card card-pad manual-search-panel"><label htmlFor="manual-query">무엇을 찾고 계신가요?</label><div className="manual-search-box"><span aria-hidden="true">⌕</span><input id="manual-query" value={query} onChange={event=>setQuery(event.target.value)} autoComplete="off" placeholder="예: 임시저장, 재제출, 편집기가 안 열려요"/><button type="button" onClick={()=>setQuery("")} disabled={!query}>지우기</button></div><div className="category-row" aria-label="매뉴얼 분야">{categories.map(item=><button type="button" key={item} className={category===item?"category active":"category"} onClick={()=>setCategory(item)}>{item}</button>)}</div><p className="help">제목을 몰라도 괜찮습니다. 평소 사용하는 표현으로 검색하세요.</p></section><section><div className="manual-result-head"><strong>{query||category!=="전체"?`검색 결과 ${results.length}건`:`전체 매뉴얼 ${results.length}건`}</strong>{(query||category!=="전체")&&<button type="button" onClick={()=>{setQuery("");setCategory("전체")}}>검색 초기화</button>}</div><div className="manual-list">{results.map(manual=><details className="card manual-item" key={manual.id}><summary><div><span className="manual-category">{manual.category}</span><h2>{manual.title}</h2><p>{manual.summary}</p></div><span className="manual-open">열기</span></summary><div className="manual-body"><ol>{manual.steps.map(step=><li key={step}>{step}</li>)}</ol>{manual.tip&&<p className="notice"><strong>도움말</strong><br/>{manual.tip}</p>}<div className="manual-meta">검색어: {manual.tags.join(" · ")} · 갱신 {manual.updatedAt}</div></div></details>)}{results.length===0&&<div className="card card-pad empty-manual"><strong>검색 결과가 없습니다.</strong><p className="subtle">단어를 짧게 바꾸거나 ‘전체’ 분야에서 다시 검색해 보세요.</p></div>}</div></section></div>
}
