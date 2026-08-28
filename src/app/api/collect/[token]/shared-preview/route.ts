import { collectionMode } from "@/lib/domain";
import { readStored } from "@/lib/files";
import { findByShareHash } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { applySharedFieldValues } from "@/lib/shared-fields";

export async function GET(_request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params,item=await findByShareHash(tokenHash(token));
    if(!item||collectionMode(item)!=="shared_fields")return Response.json({error:"유효하지 않은 공동 문서입니다."},{status:404});
    const bytes=applySharedFieldValues(new Uint8Array(await readStored(item.templateStorageKey)),item.sharedFields??[],item.sharedFieldStates??[],true);
    return new Response(Buffer.from(bytes),{headers:{"Content-Type":"application/vnd.hancom.hwpx","X-Document-Name":encodeURIComponent(item.templateName),"Cache-Control":"private, no-store"}});
  }catch(error){console.error(error);return Response.json({error:"공통 문서 미리보기를 만들지 못했습니다."},{status:500})}
}
