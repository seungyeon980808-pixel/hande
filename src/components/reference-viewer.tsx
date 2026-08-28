"use client";

import { useEffect,useRef,useState } from "react";
import type { RhwpEditor as RhwpEditorApi } from "@rhwp/editor";

/**
 * 작년 자료를 읽기용으로 띄운다.
 * hwpx는 브라우저가 직접 열 수 없으므로 편집기와 같은 뷰어로 표시해야 한다.
 */
export function ReferenceViewer({token,personId}:{token:string;personId:string}){
  const container=useRef<HTMLDivElement>(null);
  const viewer=useRef<RhwpEditorApi|null>(null);
  const [status,setStatus]=useState("작년 자료를 여는 중...");
  const [error,setError]=useState("");

  useEffect(()=>{
    let active=true;
    (async()=>{
      try{
        const response=await fetch(`/api/collect/${token}/reference?teacherId=${encodeURIComponent(personId)}`);
        if(!response.ok)throw new Error((await response.json()).error);
        const name=decodeURIComponent(response.headers.get("X-Document-Name")||"작년자료.hwpx");
        const bytes=await response.arrayBuffer();
        const {createEditor}=await import("@rhwp/editor");
        if(!active||!container.current)return;
        const boxHeight=container.current.clientHeight;
        const instance=await createEditor(container.current,{height:boxHeight>200?`${boxHeight}px`:"590px",studioUrl:process.env.NEXT_PUBLIC_RHWP_STUDIO_URL||"https://edwardkim.github.io/rhwp/"});
        viewer.current=instance;
        await instance.loadFile(bytes,name);
        if(active)setStatus(name);
      }catch(cause){if(active)setError(cause instanceof Error?cause.message:"작년 자료를 열지 못했습니다.")}
    })();
    const fit=()=>{
      const frame=container.current?.querySelector("iframe");
      const height=container.current?.clientHeight??0;
      if(frame&&height>200)frame.style.height=`${height}px`;
    };
    const timer=window.setInterval(fit,400);
    window.addEventListener("resize",fit);
    return()=>{active=false;window.clearInterval(timer);window.removeEventListener("resize",fit);viewer.current?.destroy();viewer.current=null};
  },[personId,token]);

  return <div>
    <div className="side-pane-head">작년 자료 <span className="help">{error?"":status}</span></div>
    {error&&<div className="error" style={{marginBottom:8}}>{error}</div>}
    <div className="editor-box" ref={container}/>
  </div>;
}
