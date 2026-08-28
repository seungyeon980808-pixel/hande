"use client";

import { useRouter } from "next/navigation";

/**
 * 이 브라우저에 관리 권한(쿠키)이 없는 취합의 진입 버튼.
 * 관리 링크가 곧 비밀번호이므로, 링크를 붙여넣게 해서 들어간다.
 */
export function ManageEntry({id}:{id:string}){
  const router=useRouter();
  function open(){
    const raw=window.prompt("이 브라우저에는 이 취합의 관리 권한이 없습니다.\n담당자 관리 링크를 붙여넣으세요.");
    if(!raw)return;
    const match=raw.trim().match(/\/manage\/([0-9a-f-]{36})\/([A-Za-z0-9_-]+)/);
    if(match&&match[1]===id){router.push(`/manage/${match[1]}/${match[2]}`);return}
    // 토큰만 붙여넣은 경우도 받아 준다
    const token=raw.trim().split("/").pop();
    if(token&&/^[A-Za-z0-9_-]{20,}$/.test(token)){router.push(`/manage/${id}/${token}`);return}
    window.alert("관리 링크를 인식하지 못했습니다. 주소 전체를 붙여넣어 주세요.");
  }
  return <button type="button" className="btn btn-secondary btn-small" onClick={open}>관리</button>;
}
