"use client";

import { useRouter } from "next/navigation";

/**
 * ⚠️ 시연용 임시: 관리 화면에 검증 없이 바로 들어간다.
 * 운영 전에는 관리 링크(=비밀번호) 확인 방식으로 되돌려야 한다.
 */
export function ManageEntry({id}:{id:string}){
  const router=useRouter();
  return <button type="button" className="btn btn-secondary btn-small" onClick={()=>router.push(`/manage/${id}/demo`)}>관리</button>;
}
