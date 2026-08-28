import { formatDateTime } from "@/lib/datetime";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { collectionMode,collectionType,collectionTypeLabel,type Collection } from "@/lib/domain";
import { findManaged } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { RhwpPreview } from "@/components/rhwp-preview";
import { latestVisibleFieldValue } from "@/lib/shared-fields";
import { ManageAutoRefresh } from "@/components/manage-auto-refresh";
import { ManageAccessCookie } from "@/components/manage-access-cookie";
import { CollectionSettings } from "@/components/collection-settings";

export const dynamic="force-dynamic";

export default async function ManagePage({params}:{params:Promise<{id:string;token:string}>}){
  const {id,token}=await params,item=await findManaged(id,tokenHash(token));
  if(!item)notFound();
  if(collectionMode(item)==="shared_fields")return <SharedFieldsManage item={item} id={id} token={token}/>;
  const type=collectionType(item),submitted=item.recipients.filter(recipient=>recipient.versions.length),drafting=item.recipients.filter(recipient=>recipient.drafts.length),missing=item.recipients.filter(recipient=>!recipient.versions.length&&!recipient.drafts.length);
  return <AppFrame>
    <ManageAccessCookie id={id} token={token}/>
    <div className="page-head"><div><h1>{item.title}{item.archived&&<span className="badge badge-draft" style={{marginLeft:8,verticalAlign:"middle"}}>보관됨</span>}</h1><p className="subtle">{collectionTypeLabel(type)} · 마감 {formatDateTime(item.deadline)} · 관리 링크</p></div><div className="page-actions">{type==="table"&&<a className="btn btn-primary" href={`/api/manage/${id}/${token}/export-table`}>통합 XLSX 다운로드</a>}{type==="xlsx"&&<a className="btn btn-primary" href={`/api/manage/${id}/${token}/download-latest`}>최신 제출 ZIP</a>}<ManageAutoRefresh/></div></div>
    <div className="stats"><Stat label="전체 대상" value={item.recipients.length}/><Stat label="제출 완료" value={submitted.length}/><Stat label="작성 중" value={drafting.length}/><Stat label="미작성" value={missing.length}/></div>
    <section className="card"><div className="toolbar"><strong>교사별 제출 현황</strong><span className="subtle">임시저장 내용은 관리 화면에서 열 수 없습니다.</span></div><div className="table-wrap"><table><thead><tr><th>이름</th><th>부서</th><th>상태</th><th>최근 활동</th><th>버전</th><th>{type==="table"?"제출 행":"파일"}</th></tr></thead><tbody>{item.recipients.map(recipient=>{const latest=recipient.versions.at(-1),latestDraft=[...recipient.drafts].toSorted((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0],activity=latestDraft?.updatedAt||latest?.createdAt;let status=<span className="badge badge-draft">미작성</span>;if(latestDraft&&latest)status=<span className="badge badge-late">수정 중</span>;else if(latestDraft)status=<span className="badge badge-late">작성 중</span>;else if(latest)status=<span className="badge badge-open">제출 완료</span>;return <tr key={recipient.id}><td><strong>{recipient.name}</strong></td><td>{recipient.department}</td><td>{status}</td><td>{activity?formatDateTime(activity):"-"}</td><td>{recipient.versions.length?`${recipient.versions.length}개`:"-"}</td><td>{type==="table"?(latest?.rows?`${latest.rows.length}행 · v${latest.version}`:"-"):latest?<details><summary className="download-summary">다운로드</summary><div className="version-links">{[...recipient.versions].reverse().filter(version=>version.kind!=="table").map(version=><a key={version.id} href={`/api/manage/${id}/${token}/download/${version.id}`}>v{version.version} · {formatDateTime(version.createdAt)}</a>)}</div></details>:"-"}</td></tr>})}</tbody></table></div></section>
    <CollectionSettings id={id} token={token} title={item.title} description={item.description} deadline={item.deadline} archived={Boolean(item.archived)}/>
    <p className="notice" style={{marginTop:16}}>작성 중은 서버에 임시저장됐지만 아직 최종 제출하지 않은 상태입니다. 재제출해도 기존 제출 버전은 삭제되지 않습니다.</p>
  </AppFrame>;
}

function Stat({label,value}:{label:string;value:number}){return <div className="card stat"><span>{label}</span><b>{value}</b></div>}

function SharedFieldsManage({item,id,token}:{item:Collection;id:string;token:string}){
  const fields=[...(item.sharedFields??[])].sort((a,b)=>a.order-b.order),states=item.sharedFieldStates??[],counts={submitted:0,drafting:0,unstarted:0,shared:0};
  for(const field of fields){const status=states.find(state=>state.fieldId===field.id)?.status??"unstarted";counts[status]++}
  return <AppFrame>
    <ManageAccessCookie id={id} token={token}/>
    <div className="page-head"><div><h1>{item.title}{item.archived&&<span className="badge badge-draft" style={{marginLeft:8,verticalAlign:"middle"}}>보관됨</span>}</h1><p className="subtle">지정 필드 공동작성 · 마감 {new Date(item.deadline).toLocaleString("ko-KR")} · 발행 후 설정 고정</p></div><div className="page-actions"><a className="btn btn-secondary" href={`/api/manage/${id}/${token}/download-intermediate`}>중간 HWPX</a><a className="btn btn-primary" href={`/api/manage/${id}/${token}/download-final`}>최종 HWPX</a><ManageAutoRefresh/></div></div>
    <div className="stats stats-five"><Stat label="전체 필드" value={fields.length}/><Stat label="완료" value={counts.submitted}/><Stat label="작성 중" value={counts.drafting}/><Stat label="미작성" value={counts.unstarted}/><Stat label="중간 공유" value={counts.shared}/></div>
    <section className="card card-pad manage-preview"><h2 className="section-title">제출 완료 필드 미리보기</h2><p className="subtle">최종 제출된 필드만 원본 양식에 적용합니다. 작성 중인 임시 내용은 포함하지 않습니다.</p><RhwpPreview url={`/api/manage/${id}/${token}/shared-preview`}/></section>
    <section className="card" style={{marginTop:18}}><div className="toolbar"><strong>필드별 현황</strong><span className="subtle">중간 공유·제출 내용과 버전만 표시됩니다.</span></div><div className="table-wrap"><table><thead><tr><th>순서</th><th>필드</th><th>담당자</th><th>필수</th><th>상태</th><th>공개된 최신 내용</th><th>버전</th></tr></thead><tbody>{fields.map((field,index)=>{const state=states.find(candidate=>candidate.fieldId===field.id),person=item.recipients.find(recipient=>recipient.id===field.assigneeId),status=state?.status??"unstarted",visible=latestVisibleFieldValue(field,state,true),publicVersions=(state?.versions??[]).filter(version=>version.status==="shared"||version.status==="submitted");return <tr key={field.id}><td>{index+1}</td><td><strong>{field.label}</strong><div className="help">내부 필드: {field.sourceName}</div></td><td>{person?`${person.name} · ${person.department}`:"담당자 없음"}</td><td>{field.required?"필수":"선택"}</td><td><span className={`badge ${status==="submitted"?"badge-open":status==="unstarted"?"badge-draft":"badge-late"}`}>{fieldStatusLabel(status)}</span></td><td><span className="field-value-preview">{publicVersions.length?visible:"-"}</span></td><td>{publicVersions.length?<details><summary className="download-summary">{publicVersions.length}개 보기</summary><div className="field-version-list">{[...publicVersions].reverse().map(version=><div key={version.id}><strong>v{version.version} · {version.status==="submitted"?"최종 제출":"중간 공유"}</strong><small>{new Date(version.createdAt).toLocaleString("ko-KR")}</small><p>{version.value||"(빈 내용)"}</p></div>)}</div></details>:"-"}</td></tr>})}</tbody></table></div></section>
    <p className="notice" style={{marginTop:16}}>중간 HWPX는 요청을 종료하지 않으며 중간 공유와 최종 제출 값을 함께 반영합니다. 최종 HWPX는 최종 제출 값만 반영합니다.</p>
  </AppFrame>;
}

function fieldStatusLabel(status:string){return status==="submitted"?"제출 완료":status==="shared"?"중간 공유":status==="drafting"?"작성 중 (내용 비공개)":"미작성"}
