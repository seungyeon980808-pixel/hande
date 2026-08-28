"use client";

import { useEffect,useRef,useState } from "react";
import type { RhwpEditor } from "@rhwp/editor";
import { getRhwpStudioUrl } from "@/lib/rhwp-studio-url";

export function RhwpPreview({url}:{url:string}){
  const host=useRef<HTMLDivElement>(null),editor=useRef<RhwpEditor|null>(null),[pages,setPages]=useState<string[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;const objectUrls:string[]=[];
    (async()=>{
      try{
        const response=await fetch(url,{cache:"no-store"});if(!response.ok)throw new Error((await response.json()).error);
        const {createEditor}=await import("@rhwp/editor");if(!host.current)return;
        const instance=await createEditor(host.current,{width:"1px",height:"1px",studioUrl:getRhwpStudioUrl()});editor.current=instance;
        const loaded=await instance.loadFile(await response.arrayBuffer(),"공통문서.hwpx"),next:string[]=[];
        for(let page=0;page<loaded.pageCount;page++){const svg=await instance.getPageSvg(page),objectUrl=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));objectUrls.push(objectUrl);next.push(objectUrl)}
        if(active)setPages(next);
      }catch(cause){if(active)setError(cause instanceof Error?cause.message:"미리보기를 열지 못했습니다.")}
      finally{if(active)setLoading(false)}
    })();
    return()=>{active=false;objectUrls.forEach(value=>URL.revokeObjectURL(value));editor.current?.destroy();editor.current=null};
  },[url]);
  return <div className="readonly-preview"><div ref={host} className="preview-render-host" aria-hidden="true"/>{loading&&<p className="subtle">읽기 전용 공통 문서를 준비 중입니다.</p>}{error&&<div className="error">{error}</div>}{pages.map((page,index)=><img key={page} src={page} alt={`공통 문서 ${index+1}쪽`}/>) /* eslint-disable-line @next/next/no-img-element */}</div>;
}
