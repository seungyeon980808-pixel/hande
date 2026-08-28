import { collectionMode } from "@/lib/domain";
import { readStored } from "@/lib/files";
import { findManaged } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { applySharedFieldValues } from "@/lib/shared-fields";

export async function GET(_request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{const {id,token}=await params,item=await findManaged(id,tokenHash(token));if(!item||collectionMode(item)!=="shared_fields")return Response.json({error:"권한이 없거나 요청을 찾을 수 없습니다."},{status:404});const bytes=applySharedFieldValues(new Uint8Array(await readStored(item.templateStorageKey)),item.sharedFields??[],item.sharedFieldStates??[],false);return new Response(Buffer.from(bytes),{headers:{"Content-Type":"application/vnd.hancom.hwpx","Cache-Control":"private, no-store"}})}catch(error){console.error(error);return Response.json({error:"관리 미리보기를 만들지 못했습니다."},{status:500})}
}
