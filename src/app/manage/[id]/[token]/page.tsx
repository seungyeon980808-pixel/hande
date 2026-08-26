import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { collectionType,collectionTypeLabel } from "@/lib/domain";
import { findManaged } from "@/lib/repository";
import { tokenHash } from "@/lib/security";

export const dynamic="force-dynamic";

export default async function ManagePage({params}:{params:Promise<{id:string;token:string}>}){
  const {id,token}=await params,item=await findManaged(id,tokenHash(token));
  if(!item)notFound();
  const type=collectionType(item),submitted=item.recipients.filter(recipient=>recipient.versions.length),drafting=item.recipients.filter(recipient=>recipient.drafts.length),missing=item.recipients.filter(recipient=>!recipient.versions.length&&!recipient.drafts.length);
  return <AppFrame>
    <div className="page-head"><div><h1>{item.title}</h1><p className="subtle">{collectionTypeLabel(type)} · 마감 {new Date(item.deadline).toLocaleString("ko-KR")} · 관리 링크</p></div><div className="page-actions">{type==="table"&&<a className="btn btn-primary" href={`/api/manage/${id}/${token}/export-table`}>통합 XLSX 다운로드</a>}{type==="xlsx"&&<a className="btn btn-primary" href={`/api/manage/${id}/${token}/download-latest`}>최신 제출 ZIP</a>}<Link className="btn btn-secondary" href={`/manage/${id}/${token}`}>현황 새로고침</Link></div></div>
    <div className="stats"><Stat label="전체 대상" value={item.recipients.length}/><Stat label="제출 완료" value={submitted.length}/><Stat label="작성 중" value={drafting.length}/><Stat label="미작성" value={missing.length}/></div>
    <section className="card"><div className="toolbar"><strong>교사별 제출 현황</strong><span className="subtle">임시저장 내용은 관리 화면에서 열 수 없습니다.</span></div><div className="table-wrap"><table><thead><tr><th>이름</th><th>부서</th><th>상태</th><th>최근 활동</th><th>버전</th><th>{type==="table"?"제출 행":"파일"}</th></tr></thead><tbody>{item.recipients.map(recipient=>{const latest=recipient.versions.at(-1),latestDraft=[...recipient.drafts].toSorted((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0],activity=latestDraft?.updatedAt||latest?.createdAt;let status=<span className="badge badge-draft">미작성</span>;if(latestDraft&&latest)status=<span className="badge badge-late">수정 중</span>;else if(latestDraft)status=<span className="badge badge-late">작성 중</span>;else if(latest)status=<span className="badge badge-open">제출 완료</span>;return <tr key={recipient.id}><td><strong>{recipient.name}</strong></td><td>{recipient.department}</td><td>{status}</td><td>{activity?new Date(activity).toLocaleString("ko-KR"):"-"}</td><td>{recipient.versions.length?`${recipient.versions.length}개`:"-"}</td><td>{type==="table"?(latest?.rows?`${latest.rows.length}행 · v${latest.version}`:"-"):latest?<details><summary className="download-summary">다운로드</summary><div className="version-links">{[...recipient.versions].reverse().filter(version=>version.kind!=="table").map(version=><a key={version.id} href={`/api/manage/${id}/${token}/download/${version.id}`}>v{version.version} · {new Date(version.createdAt).toLocaleString("ko-KR")}</a>)}</div></details>:"-"}</td></tr>})}</tbody></table></div></section>
    <p className="notice" style={{marginTop:16}}>작성 중은 서버에 임시저장됐지만 아직 최종 제출하지 않은 상태입니다. 재제출해도 기존 제출 버전은 삭제되지 않습니다.</p>
  </AppFrame>;
}

function Stat({label,value}:{label:string;value:number}){return <div className="card stat"><span>{label}</span><b>{value}</b></div>}
