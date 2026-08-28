import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { teachers,type CollectionMode,type CollectionType,type SharedFieldInitialContentMode } from "@/lib/domain";
import { deleteStored,storeFile,storeSpreadsheet,validateDocument } from "@/lib/files";
import { saveCollection } from "@/lib/repository";
import { newToken,tokenHash,safeFileName } from "@/lib/security";
import { setManageAccessCookie } from "@/lib/manage-access";
import { parseTableDefinition } from "@/lib/table";
import { extractNamedFields } from "@/lib/shared-fields";

const schema=z.object({
  type:z.enum(["document","table","xlsx"]),
  mode:z.enum(["individual","shared_fields"]).default("individual"),
  title:z.string().trim().min(2).max(80),
  description:z.string().trim().max(500),
  deadline:z.coerce.date().refine(date=>date.getTime()>Date.now(),"마감일은 현재 이후여야 합니다.").refine(date=>date.getMinutes()===0&&date.getSeconds()===0&&date.getMilliseconds()===0,"마감 시간은 정각 단위로 지정하세요."),
  recipientIds:z.array(z.string()).min(1,"제출 대상을 한 명 이상 선택하세요."),
});

export async function POST(request:Request){
  let pendingStorageKey="";
  try{
    const form=await request.formData();
    const parsed=schema.safeParse({type:form.get("type"),mode:form.get("mode")??"individual",title:form.get("title"),description:form.get("description")??"",deadline:form.get("deadline"),recipientIds:form.getAll("recipientIds")});
    if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
    const chosen=teachers.filter(teacher=>parsed.data.recipientIds.includes(teacher.id));
    if(chosen.length!==new Set(parsed.data.recipientIds).size)return Response.json({error:"제출 대상 정보가 올바르지 않습니다."},{status:400});

    const type=parsed.data.type as CollectionType,mode:CollectionMode=type==="document"?parsed.data.mode:"individual";
    let templateStorageKey="",templateName="",templateSize=0;
    let table;
    let sharedFields;
    if(type==="table"){
      table=parseTableDefinition(String(form.get("tableColumns")||""),String(form.get("tableRows")||""));
    }else{
      const file=form.get("template");
      if(!(file instanceof File)||file.size===0)return Response.json({error:"양식 파일을 선택하세요."},{status:400});
      if(mode==="shared_fields"){
        if(!file.name.toLowerCase().endsWith(".hwpx"))return Response.json({error:"지정 필드 공동작성은 HWPX 양식만 지원합니다."},{status:400});
        validateDocument(file);
        const extracted=extractNamedFields(new Uint8Array(await file.arrayBuffer()));
        if(!extracted.length)return Response.json({error:"작성 영역을 한 개 이상 지정하세요."},{status:400});
        const raw=JSON.parse(String(form.get("sharedFields")||"[]")) as Array<{sourceName?:string;label?:string;assigneeId?:string;required?:boolean;initialContentMode?:SharedFieldInitialContentMode}>;
        if(raw.length!==extracted.length)return Response.json({error:"양식의 필드 설정이 완전하지 않습니다. 필드를 다시 불러오세요."},{status:400});
        const extractedNames=new Set(extracted.map(field=>field.sourceName));
        if(raw.some(field=>!field.sourceName||!extractedNames.has(field.sourceName))||new Set(raw.map(field=>field.sourceName)).size!==extracted.length)return Response.json({error:"양식 필드 정보가 변경되었습니다. 필드를 다시 불러오세요."},{status:400});
        if(raw.some(field=>!field.assigneeId))return Response.json({error:"모든 필드에 담당자를 지정하세요."},{status:400});
        const chosenIds=new Set(chosen.map(person=>person.id));
        if(raw.some(field=>!chosenIds.has(field.assigneeId!)))return Response.json({error:"필드 담당자는 제출 대상에 포함되어야 합니다."},{status:400});
        sharedFields=raw.map((field,index)=>{const source=extracted.find(item=>item.sourceName===field.sourceName)!;return {id:randomUUID(),sourceName:source.sourceName,label:String(field.label||source.label).trim().slice(0,80)||source.sourceName,assigneeId:field.assigneeId!,required:Boolean(field.required),order:index,initialContentMode:field.initialContentMode==="blank"?"blank" as const:"template" as const,initialValue:source.initialValue}});
      }
      const stored=type==="xlsx"?await storeSpreadsheet(file):await storeFile(file);
      pendingStorageKey=stored.key;
      templateStorageKey=stored.key;
      templateName=safeFileName(file.name);
      templateSize=stored.size;
    }

    const id=randomUUID(),share=newToken(),manage=newToken();
    await saveCollection({
      id,type,mode,title:parsed.data.title,description:parsed.data.description,deadline:parsed.data.deadline.toISOString(),
      shareTokenHash:tokenHash(share),manageTokenHash:tokenHash(manage),templateStorageKey,templateName,templateSize,table,
      sharedFields,sharedFieldStates:sharedFields?.map(field=>({fieldId:field.id,status:"unstarted" as const,drafts:[],versions:[]})),createdAt:new Date().toISOString(),recipients:chosen.map(teacher=>({...teacher,versions:[],drafts:[]})),
    });
    pendingStorageKey="";
    const requestUrl=new URL(request.url),forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),host=forwardedHost||request.headers.get("host"),forwardedProtocol=request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const origin=host?`${forwardedProtocol||requestUrl.protocol.replace(":","")}://${host}`:requestUrl.origin;
    const assignedIds=new Set(sharedFields?.map(field=>field.assigneeId)??[]),warnings=mode==="shared_fields"?chosen.filter(person=>!assignedIds.has(person.id)).map(person=>`${person.name}(${person.department})에게 지정된 필드가 없습니다.`):[];
    const response=NextResponse.json({shareUrl:`${origin}/collect/${share}`,manageUrl:`${origin}/manage/${id}/${manage}`,warnings},{status:201});
    setManageAccessCookie(response,id,manage);
    return response;
  }catch(error){
    console.error(error);
    if(pendingStorageKey)await deleteStored(pendingStorageKey).catch(cleanupError=>console.error("요청 생성 실패 양식 정리 오류",cleanupError));
    return Response.json({error:error instanceof Error?error.message:"요청 생성 중 오류가 발생했습니다."},{status:500});
  }
}
