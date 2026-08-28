"use client";

import { useEffect,useId,useRef,useState } from "react";

/**
 * 눈에 띄는 파일 선택 영역. 클릭과 드래그앤드롭을 모두 받는다.
 * form 안에서 쓰려면 name 을 넘겨 실제 <input type="file"> 값으로 제출한다.
 */
export function FileDrop({accept,name,required=false,hint,file,onPick,initial}:{
  accept:string;name?:string;required?:boolean;hint?:string;
  file?:File|null;onPick?:(file:File|null)=>void;initial?:File;
}){
  const input=useRef<HTMLInputElement>(null);
  const id=useId();
  const [over,setOver]=useState(false);
  const [inner,setInner]=useState<File|null>(null);
  const picked=file!==undefined?file:inner;

  // 다른 화면에서 넘어온 파일을 실제 input 값으로 넣어 폼 제출에 포함되게 한다.
  useEffect(()=>{
    if(!initial||!input.current||input.current.files?.length)return;
    const list=new DataTransfer();
    list.items.add(initial);
    input.current.files=list.files;
    setInner(initial);
  },[initial]);

  function choose(next:File|null){
    if(file===undefined)setInner(next);
    onPick?.(next);
  }

  function onDrop(event:React.DragEvent){
    event.preventDefault();setOver(false);
    const dropped=event.dataTransfer.files?.[0];
    if(!dropped)return;
    // 드롭한 파일도 확장자를 확인해 form 제출 값으로 넣는다.
    const allowed=accept.split(",").map(part=>part.trim().toLowerCase());
    const dot=dropped.name.lastIndexOf(".");
    const ext=dot<0?"":dropped.name.slice(dot).toLowerCase();
    if(allowed.length&&!allowed.includes(ext))return;
    if(input.current){
      const list=new DataTransfer();
      list.items.add(dropped);
      input.current.files=list.files;
    }
    choose(dropped);
  }

  return <div>
    <label htmlFor={id}
      className={`file-drop${over?" is-over":""}${picked?" is-picked":""}`}
      onDragOver={event=>{event.preventDefault();setOver(true)}}
      onDragLeave={()=>setOver(false)}
      onDrop={onDrop}>
      <input ref={input} id={id} type="file" accept={accept} name={name} required={required&&!picked}
        onChange={event=>choose(event.target.files?.[0]??null)}/>
      <span className="file-drop-icon" aria-hidden>＋</span>
      {picked
        ? <><strong>{picked.name}</strong><span className="help">다시 고르려면 클릭하거나 파일을 끌어다 놓으세요</span></>
        : <><strong>클릭해서 파일 선택</strong><span className="help">또는 여기로 파일을 끌어다 놓으세요{hint?` · ${hint}`:""}</span></>}
    </label>
  </div>;
}
