"use client";

import { useRouter } from "next/navigation";
import { collectionTypeLabel,type CollectionType } from "@/lib/domain";

type ManageCollectionRowProps={
  id:string;
  title:string;
  type:CollectionType;
  deadline:string;
  recipientCount:number;
  submittedCount:number;
};

export function ManageCollectionRow({id,title,type,deadline,recipientCount,submittedCount}:ManageCollectionRowProps){
  const router=useRouter();
  const open=()=>router.push(`/manage/${id}`);
  return <tr className="manage-row" tabIndex={0} role="link" aria-label={`${title} 관리 화면 열기`} onClick={open} onKeyDown={event=>{
    if(event.key==="Enter"||event.key===" "){
      event.preventDefault();
      open();
    }
  }}>
    <td><strong>{title}</strong></td>
    <td><span className="badge badge-type">{collectionTypeLabel(type)}</span></td>
    <td>{new Date(deadline).toLocaleString("ko-KR")}</td>
    <td>{recipientCount}명</td>
    <td>{submittedCount}/{recipientCount}</td>
    <td><span className="badge badge-open">진행 중</span></td>
  </tr>;
}
