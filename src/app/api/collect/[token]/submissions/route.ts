import { randomUUID } from "node:crypto";
import { assertCollectionOpen,CollectionClosedError,collectionClosed,collectionMode,collectionType } from "@/lib/domain";
import { deleteStored,storeFile,storeSpreadsheet } from "@/lib/files";
import { findByShareHash,mutateCollection } from "@/lib/repository";
import { safeFileName,tokenHash } from "@/lib/security";

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params;
    const item=await findByShareHash(tokenHash(token));
    if(!item)return Response.json({error:"유효하지 않은 제출 링크입니다."},{status:404});
    if(collectionMode(item)==="shared_fields")return Response.json({error:"지정 필드 공동작성은 필드 제출 주소를 사용하세요."},{status:400});
    if(collectionClosed(item))return Response.json({error:"제출 마감 시간이 지났습니다. 담당자에게 문의하세요."},{status:409});
    const form=await request.formData();
    const teacherId=String(form.get("teacherId")||"");
    const draftKey=String(form.get("draftKey")||"");
    const person=item.recipients.find(r=>r.id===teacherId);
    const file=form.get("document");
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    if(!(file instanceof File))return Response.json({error:"제출 문서가 없습니다."},{status:400});
    const type=collectionType(item);
    if(type==="table")return Response.json({error:"표 데이터 제출 주소가 아닙니다."},{status:400});
    const stored=type==="xlsx"?await storeSpreadsheet(file):await storeFile(file);
    let version=0;
    let completedDraftKey:string|undefined;
    try{await mutateCollection(item.id,current=>{
      assertCollectionOpen(current);
      const recipient=current.recipients.find(r=>r.id===teacherId);
      if(!recipient)throw new Error("대상자를 찾을 수 없습니다.");
      version=recipient.versions.length+1;
      const extension=type==="xlsx"?"xlsx":"hwpx";
      recipient.versions.push({id:randomUUID(),version,kind:"file",storageKey:stored.key,displayName:safeFileName(`${current.title}_${person.name}_v${version}.${extension}`),size:stored.size,createdAt:new Date().toISOString()});
      if(draftKey){
        recipient.drafts??=[];
        const index=recipient.drafts.findIndex(d=>d.deviceKeyHash===tokenHash(draftKey));
        if(index>=0)completedDraftKey=recipient.drafts.splice(index,1)[0]?.storageKey;
      }
    })}catch(error){await deleteStored(stored.key).catch(cleanupError=>console.error("제출 실패 파일 정리 오류",cleanupError));throw error}
    if(completedDraftKey)await deleteStored(completedDraftKey).catch(cleanupError=>console.error("제출 완료 임시파일 정리 오류",cleanupError));
    return Response.json({ok:true,version});
  }catch(error){
    console.error(error);
    if(error instanceof CollectionClosedError)return Response.json({error:error.message},{status:409});
    return Response.json({error:error instanceof Error?error.message:"제출 중 오류가 발생했습니다."},{status:500});
  }
}
