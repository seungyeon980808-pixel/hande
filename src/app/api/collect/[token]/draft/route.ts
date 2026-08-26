import { randomUUID } from "node:crypto";
import { z } from "zod";
import { collectionType } from "@/lib/domain";
import { deleteStored,readStored,storeFile,storeSpreadsheet } from "@/lib/files";
import { findByShareHash,mutateCollection } from "@/lib/repository";
import { safeFileName,tokenHash } from "@/lib/security";

const identitySchema=z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid()});

export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){try{const {token}=await params,item=await findByShareHash(tokenHash(token));if(!item)return Response.json({error:"유효하지 않은 제출 링크입니다."},{status:404});if(collectionType(item)==="table")return Response.json({error:"파일 임시저장 주소가 아닙니다."},{status:400});const url=new URL(request.url),parsed=identitySchema.safeParse({teacherId:url.searchParams.get("teacherId"),draftKey:url.searchParams.get("draftKey")});if(!parsed.success)return Response.json({error:"임시저장 정보를 확인할 수 없습니다."},{status:400});const person=item.recipients.find(r=>r.id===parsed.data.teacherId);if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});const draft=(person.drafts??[]).find(d=>d.deviceKeyHash===tokenHash(parsed.data.draftKey)&&d.kind!=="table");if(!draft)return new Response(null,{status:204,headers:{"Cache-Control":"no-store"}});const bytes=await readStored(draft.storageKey);return new Response(bytes,{headers:{"Content-Type":"application/octet-stream","X-Document-Name":encodeURIComponent(draft.displayName),"X-Draft-Updated-At":draft.updatedAt,"Cache-Control":"private, no-store"}})}catch(error){console.error(error);return Response.json({error:"임시저장 문서를 불러오지 못했습니다."},{status:500})}}

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item)return Response.json({error:"유효하지 않은 제출 링크입니다."},{status:404});
    const type=collectionType(item);
    if(type==="table")return Response.json({error:"파일 임시저장 주소가 아닙니다."},{status:400});
    const form=await request.formData(),parsed=identitySchema.safeParse({teacherId:form.get("teacherId"),draftKey:form.get("draftKey")}),file=form.get("document");
    if(!parsed.success)return Response.json({error:"임시저장 정보를 확인할 수 없습니다."},{status:400});
    const person=item.recipients.find(r=>r.id===parsed.data.teacherId);
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    if(!(file instanceof File))return Response.json({error:"임시저장할 문서가 없습니다."},{status:400});
    const stored=type==="xlsx"?await storeSpreadsheet(file):await storeFile(file),updatedAt=new Date().toISOString(),deviceKeyHash=tokenHash(parsed.data.draftKey);
    let replacedKey:string|undefined;
    try{await mutateCollection(item.id,current=>{
      const recipient=current.recipients.find(r=>r.id===parsed.data.teacherId);
      if(!recipient)throw new Error("대상자를 찾을 수 없습니다.");
      recipient.drafts??=[];
      const existing=recipient.drafts.find(d=>d.deviceKeyHash===deviceKeyHash&&d.kind!=="table"),extension=type==="xlsx"?"xlsx":"hwpx";
      if(existing){replacedKey=existing.storageKey;Object.assign(existing,{kind:"file",storageKey:stored.key,displayName:safeFileName(`${current.title}_${person.name}_임시저장.${extension}`),size:stored.size,updatedAt})}
      else recipient.drafts.push({id:randomUUID(),deviceKeyHash,kind:"file",storageKey:stored.key,displayName:safeFileName(`${current.title}_${person.name}_임시저장.${extension}`),size:stored.size,updatedAt});
    })}catch(error){await deleteStored(stored.key).catch(cleanupError=>console.error("임시저장 실패 파일 정리 오류",cleanupError));throw error}
    if(replacedKey)await deleteStored(replacedKey).catch(cleanupError=>console.error("교체된 임시파일 정리 오류",cleanupError));
    return Response.json({ok:true,updatedAt});
  }catch(error){console.error(error);return Response.json({error:error instanceof Error?error.message:"임시저장 중 오류가 발생했습니다."},{status:500})}
}
