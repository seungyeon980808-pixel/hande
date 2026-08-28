"use client";

/**
 * 빈 양식을 만든 자리에서 취합 요청 화면으로 파일을 넘긴다.
 * 사용자가 다운로드한 파일을 다시 찾아 올리지 않아도 되게 하는 임시 보관이다.
 * 세션 저장소를 쓰므로 탭을 닫으면 사라지고 서버로는 가지 않는다.
 */
const KEY="school-work-handoff";

type Stored={template:{name:string;data:string};reference?:{name:string;data:string};targetYear?:number};

function toBase64(bytes:ArrayBuffer){
  const view=new Uint8Array(bytes);
  let binary="";
  for(let index=0;index<view.length;index+=0x8000)binary+=String.fromCharCode(...view.subarray(index,index+0x8000));
  return btoa(binary);
}

function toFile(entry:{name:string;data:string}){
  const binary=atob(entry.data);
  const bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  return new File([bytes],entry.name,{type:"application/vnd.hancom.hwpx"});
}

/** 취합 요청 화면으로 넘길 파일을 담아 둔다. 용량이 크면 담지 않는다. */
export async function putHandoff(template:File,reference?:File,targetYear?:number){
  // 세션 저장소는 보통 5MB 안팎이라 base64 로 부풀려도 담기는 크기만 넘긴다.
  const limit=1.5*1024*1024;
  if(template.size>limit||(reference&&reference.size>limit))return false;
  try{
    const payload:Stored={template:{name:template.name,data:toBase64(await template.arrayBuffer())},targetYear};
    if(reference)payload.reference={name:reference.name,data:toBase64(await reference.arrayBuffer())};
    sessionStorage.setItem(KEY,JSON.stringify(payload));
    return true;
  }catch{return false}
}

/** 넘어온 파일을 꺼내고 보관분은 지운다. */
export function takeHandoff(){
  try{
    const raw=sessionStorage.getItem(KEY);
    if(!raw)return null;
    sessionStorage.removeItem(KEY);
    const parsed=JSON.parse(raw) as Stored;
    return {
      template:toFile(parsed.template),
      reference:parsed.reference?toFile(parsed.reference):null,
      targetYear:parsed.targetYear,
    };
  }catch{return null}
}
