import { randomUUID } from "node:crypto";
import { z } from "zod";
import { assertCollectionOpen,CollectionClosedError,collectionMode } from "@/lib/domain";
import { findByShareHash,mutateCollection } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { latestVisibleFieldValue } from "@/lib/shared-fields";

const getSchema=z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid()});
const actionSchema=z.enum(["draft","shared","submitted"]);
const fieldValueSchema=z.object({fieldId:z.string().uuid(),value:z.string().max(20000)});
const postSchema=z.union([
  z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid(),fieldId:z.string().uuid(),action:actionSchema,value:z.string().max(20000)}),
  z.object({teacherId:z.string().min(1).max(40),draftKey:z.string().uuid(),action:actionSchema,fields:z.array(fieldValueSchema).min(1).max(100)}),
]);

export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionMode(item)!=="shared_fields")return Response.json({error:"유효하지 않은 지정 필드 공동작성 링크입니다."},{status:404});
    const url=new URL(request.url),parsed=getSchema.safeParse({teacherId:url.searchParams.get("teacherId"),draftKey:url.searchParams.get("draftKey")});
    if(!parsed.success)return Response.json({error:"작성자 정보를 확인할 수 없습니다."},{status:400});
    const person=item.recipients.find(recipient=>recipient.id===parsed.data.teacherId);
    if(!person)return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    const draftHash=tokenHash(parsed.data.draftKey),fields=(item.sharedFields??[]).filter(field=>field.assigneeId===person.id).sort((a,b)=>a.order-b.order).map(field=>{
      const state=(item.sharedFieldStates??[]).find(candidate=>candidate.fieldId===field.id),draft=state?.drafts.find(candidate=>candidate.deviceKeyHash===draftHash);
      return {id:field.id,sourceName:field.sourceName,label:field.label,required:field.required,order:field.order,status:state?.status??"unstarted",value:draft?.value??latestVisibleFieldValue(field,state),draftUpdatedAt:draft?.updatedAt??null,versionCount:state?.versions.length??0};
    });
    return Response.json({fields});
  }catch(error){console.error(error);return Response.json({error:"필드 내용을 불러오지 못했습니다."},{status:500})}
}

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionMode(item)!=="shared_fields")return Response.json({error:"유효하지 않은 지정 필드 공동작성 링크입니다."},{status:404});
    const parsed=postSchema.safeParse(await request.json());
    if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message??"필드 저장 정보가 올바르지 않습니다."},{status:400});
    const now=new Date().toISOString(),draftHash=tokenHash(parsed.data.draftKey),updates="fields" in parsed.data?parsed.data.fields:[{fieldId:parsed.data.fieldId,value:parsed.data.value}];
    if(new Set(updates.map(update=>update.fieldId)).size!==updates.length)return Response.json({error:"같은 필드가 중복되었습니다."},{status:400});
    const versions:Record<string,number>={};
    await mutateCollection(item.id,current=>{
      if(parsed.data.action!=="draft")assertCollectionOpen(current);
      const person=current.recipients.find(recipient=>recipient.id===parsed.data.teacherId);
      if(!person)throw new Error("제출 대상자를 확인할 수 없습니다.");
      const fields=updates.map(update=>({update,field:current.sharedFields?.find(candidate=>candidate.id===update.fieldId)}));
      if(fields.some(({field})=>!field||field.assigneeId!==person.id))throw new Error("본인에게 지정된 필드만 저장할 수 있습니다.");
      const missingRequired=parsed.data.action==="submitted"?fields.find(({field,update})=>field!.required&&!update.value.trim()):undefined;
      if(missingRequired)throw new Error(`${missingRequired.field!.label} 필드는 내용을 입력한 뒤 제출하세요.`);
      current.sharedFieldStates??=[];
      for(const {field,update} of fields){
        let state=current.sharedFieldStates.find(candidate=>candidate.fieldId===field!.id);
        if(!state){state={fieldId:field!.id,status:"unstarted",drafts:[],versions:[]};current.sharedFieldStates.push(state)}
        if(parsed.data.action==="draft"){
          const draft=state.drafts.find(candidate=>candidate.deviceKeyHash===draftHash);
          if(draft)Object.assign(draft,{value:update.value,updatedAt:now});else state.drafts.push({deviceKeyHash:draftHash,value:update.value,updatedAt:now});
          state.status="drafting";
        }else{
          const version=state.versions.length+1;versions[field!.id]=version;
          state.versions.push({id:randomUUID(),version,status:parsed.data.action,value:update.value,createdAt:now});
          state.drafts=state.drafts.filter(candidate=>candidate.deviceKeyHash!==draftHash);
          state.status=parsed.data.action;
        }
      }
    });
    return Response.json({ok:true,status:parsed.data.action==="draft"?"drafting":parsed.data.action,updatedAt:now,versions});
  }catch(error){
    console.error(error);
    if(error instanceof CollectionClosedError)return Response.json({error:error.message},{status:409});
    return Response.json({error:error instanceof Error?error.message:"필드를 저장하지 못했습니다."},{status:500});
  }
}
