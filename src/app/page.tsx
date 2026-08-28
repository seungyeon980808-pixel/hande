import { formatDateTime } from "@/lib/datetime";
import Link from "next/link";
import { listCollections } from "@/lib/repository";
import { AppFrame } from "@/components/app-frame";
import { collectionType,collectionTypeLabel } from "@/lib/domain";
export const dynamic="force-dynamic";
export default async function Home(){const items=await listCollections();const total=items.reduce((sum,item)=>sum+item.recipients.length,0),submitted=items.reduce((sum,item)=>sum+item.recipients.filter(recipient=>recipient.versions.length).length,0);return <AppFrame><div className="page-head"><div><h1>업무 취합</h1><p className="subtle">한글 문서와 엑셀 데이터를 하나의 링크에서 받고 진행 상황까지 확인합니다.</p></div><Link className="btn btn-primary" href="/requests/new">+ 새 취합 요청</Link></div><div className="stats"><Stat label="진행 중 요청" value={items.length}/><Stat label="전체 대상" value={total}/><Stat label="제출 완료" value={submitted}/><Stat label="미제출" value={total-submitted}/></div><section className="card"><div className="toolbar"><strong>최근 취합 요청</strong><span className="subtle">총 {items.length}건</span></div><div className="table-wrap"><table><thead><tr><th>요청명</th><th>유형</th><th>마감일</th><th>대상</th><th>제출</th><th>상태</th></tr></thead><tbody>{items.length?items.map(item=>{const count=item.recipients.filter(recipient=>recipient.versions.length).length,type=collectionType(item);return <tr key={item.id}><td><strong>{item.title}</strong></td><td><span className="badge badge-type">{collectionTypeLabel(type)}</span></td><td>{formatDateTime(item.deadline)}</td><td>{item.recipients.length}명</td><td>{count}/{item.recipients.length}</td><td><span className="badge badge-open">진행 중</span></td></tr>}):<tr><td colSpan={6} style={{textAlign:"center",padding:42,color:"#607080"}}>아직 요청이 없습니다. 첫 취합 요청을 만들어 보세요.</td></tr>}</tbody></table></div></section></AppFrame>}
function Stat({label,value}:{label:string;value:number}){
  let c="card stat";
  if(label==="진행 중 요청") c+=" stat-primary";
  else if(label==="제출 완료") c+=" stat-success";
  else if(label==="마감 임박") c+=" stat-warning";
  else if(label==="미제출") c+=" stat-error";
  return <div className={c}><span>{label}</span><b>{value}</b></div>;
}
