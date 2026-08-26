import { randomUUID } from "node:crypto";
import { z } from "zod";
import { collectionType } from "@/lib/domain";
import { findByShareHash,mutateCollection } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { normalizeRows } from "@/lib/table";

const identity=z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid()});

export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionType(item)!=="table"||!item.table)return Response.json({error:"유효하지 않은 표 제출 링크입니다."},{status:404});
    const url=new URL(request.url),parsed=identity.safeParse({teacherId:url.searchParams.get("teacherId"),draftKey:url.searchParams.get("draftKey")});
    if(!parsed.success)return Response.json({error:"임시저장 정보를 확인할 수 없습니다."},{status:400});
    const person=item.recipients.find(recipient=>recipient.id===parsed.data.teacherId);
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    const draft=person.drafts.find(value=>value.kind==="table"&&value.deviceKeyHash===tokenHash(parsed.data.draftKey));
    if(!draft)return new Response(null,{status:204,headers:{"Cache-Control":"no-store"}});
    return Response.json({rows:draft.rows,updatedAt:draft.updatedAt},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){console.error(error);return Response.json({error:"임시저장 표를 불러오지 못했습니다."},{status:500})}
}

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionType(item)!=="table"||!item.table)return Response.json({error:"유효하지 않은 표 제출 링크입니다."},{status:404});
    const body=await request.json(),parsed=identity.safeParse(body);
    if(!parsed.success)return Response.json({error:"임시저장 정보를 확인할 수 없습니다."},{status:400});
    const person=item.recipients.find(recipient=>recipient.id===parsed.data.teacherId);
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    const rows=normalizeRows(item.table.columns,body.rows,{allowBlank:true}),updatedAt=new Date().toISOString(),deviceKeyHash=tokenHash(parsed.data.draftKey);
    await mutateCollection(item.id,current=>{
      const recipient=current.recipients.find(value=>value.id===parsed.data.teacherId);
      if(!recipient)throw new Error("대상자를 찾을 수 없습니다.");
      const existing=recipient.drafts.find(value=>value.kind==="table"&&value.deviceKeyHash===deviceKeyHash);
      const next={kind:"table" as const,storageKey:"",displayName:`${current.title}_${person.name}_표_임시저장`,size:Buffer.byteLength(JSON.stringify(rows)),updatedAt,rows};
      if(existing)Object.assign(existing,next);else recipient.drafts.push({id:randomUUID(),deviceKeyHash,...next});
    });
    return Response.json({ok:true,updatedAt});
  }catch(error){console.error(error);return Response.json({error:error instanceof Error?error.message:"임시저장 중 오류가 발생했습니다."},{status:500})}
}
