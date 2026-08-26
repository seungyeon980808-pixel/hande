import { randomUUID } from "node:crypto";
import { z } from "zod";
import { assertCollectionOpen,CollectionClosedError,collectionClosed,collectionType } from "@/lib/domain";
import { findByShareHash,mutateCollection } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { normalizeRows } from "@/lib/table";

const identity=z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid()});

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionType(item)!=="table"||!item.table)return Response.json({error:"유효하지 않은 표 제출 링크입니다."},{status:404});
    if(collectionClosed(item))return Response.json({error:"제출 마감 시간이 지났습니다. 담당자에게 문의하세요."},{status:409});
    const body=await request.json(),parsed=identity.safeParse(body);
    if(!parsed.success)return Response.json({error:"제출자 정보를 확인할 수 없습니다."},{status:400});
    const person=item.recipients.find(recipient=>recipient.id===parsed.data.teacherId);
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    const rows=normalizeRows(item.table.columns,body.rows,{allowBlank:false});
    let version=0;
    await mutateCollection(item.id,current=>{
      assertCollectionOpen(current);
      const recipient=current.recipients.find(value=>value.id===parsed.data.teacherId);
      if(!recipient)throw new Error("대상자를 찾을 수 없습니다.");
      version=recipient.versions.length+1;
      recipient.versions.push({id:randomUUID(),version,kind:"table",storageKey:"",displayName:`${current.title}_${person.name}_표_v${version}`,size:Buffer.byteLength(JSON.stringify(rows)),createdAt:new Date().toISOString(),rows});
      const index=recipient.drafts.findIndex(value=>value.kind==="table"&&value.deviceKeyHash===tokenHash(parsed.data.draftKey));
      if(index>=0)recipient.drafts.splice(index,1);
    });
    return Response.json({ok:true,version});
  }catch(error){console.error(error);if(error instanceof CollectionClosedError)return Response.json({error:error.message},{status:409});return Response.json({error:error instanceof Error?error.message:"제출 중 오류가 발생했습니다."},{status:500})}
}
