import { z } from "zod";
import { deleteStored } from "@/lib/files";
import { deleteCollection,findManaged,mutateCollection } from "@/lib/repository";
import { tokenHash } from "@/lib/security";

export const dynamic="force-dynamic";

const patchSchema=z.object({
  title:z.string().trim().min(2).max(80).optional(),
  description:z.string().trim().max(500).optional(),
  deadline:z.coerce.date()
    .refine(date=>date.getTime()>Date.now(),"마감일은 현재 이후여야 합니다.")
    .refine(date=>date.getMinutes()===0&&date.getSeconds()===0&&date.getMilliseconds()===0,"마감 시간은 정각 단위로 지정하세요.")
    .optional(),
  archived:z.boolean().optional(),
});

async function authorize(params:Promise<{id:string;token:string}>){
  const {id,token}=await params;
  const item=await findManaged(id,tokenHash(token));
  return item?{id,item}:null;
}

/** 취합의 제목·안내·마감·보관 상태를 고친다. 관리 링크가 곧 권한이다. */
export async function PATCH(request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{
    const found=await authorize(params);
    if(!found)return Response.json({error:"관리 권한을 확인할 수 없습니다."},{status:404});
    const parsed=patchSchema.safeParse(await request.json());
    if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
    const changes=parsed.data;
    await mutateCollection(found.id,item=>{
      if(changes.title!==undefined)item.title=changes.title;
      if(changes.description!==undefined)item.description=changes.description;
      if(changes.deadline!==undefined)item.deadline=changes.deadline.toISOString();
      if(changes.archived!==undefined)item.archived=changes.archived;
    });
    return Response.json({ok:true});
  }catch(error){
    console.error(error);
    return Response.json({error:"수정 중 오류가 발생했습니다."},{status:500});
  }
}

/**
 * 취합을 완전히 삭제한다. 제출본·임시저장 파일까지 함께 지운다.
 * 목적과철학.md 4번 기준(자료가 어디에 남는지 답할 수 있어야 한다)을 위해
 * 저장 파일을 남기지 않는다.
 */
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{
    const found=await authorize(params);
    if(!found)return Response.json({error:"관리 권한을 확인할 수 없습니다."},{status:404});
    const item=found.item;
    const keys=new Set<string>();
    if(item.templateStorageKey)keys.add(item.templateStorageKey);
    if(item.reference?.storageKey)keys.add(item.reference.storageKey);
    for(const recipient of item.recipients){
      for(const version of recipient.versions)if(version.storageKey)keys.add(version.storageKey);
      for(const draft of recipient.drafts)if(draft.storageKey)keys.add(draft.storageKey);
    }
    await deleteCollection(found.id);
    // 목록에서 먼저 지운 뒤 파일을 정리한다. 파일 삭제가 일부 실패해도 링크는 이미 죽어 있다.
    const results=await Promise.allSettled([...keys].map(key=>deleteStored(key)));
    const failed=results.filter(result=>result.status==="rejected").length;
    if(failed)console.error(`취합 삭제: 파일 ${failed}건 정리 실패`);
    return Response.json({ok:true,removedFiles:keys.size-failed});
  }catch(error){
    console.error(error);
    return Response.json({error:"삭제 중 오류가 발생했습니다."},{status:500});
  }
}
