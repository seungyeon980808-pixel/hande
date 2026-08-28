import { collectionMode } from "@/lib/domain";
import { readStored } from "@/lib/files";
import { findManaged } from "@/lib/repository";
import { safeFileName,tokenHash } from "@/lib/security";
import { applySharedFieldValues } from "@/lib/shared-fields";

export async function GET(_request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{const {id,token}=await params,item=await findManaged(id,tokenHash(token));if(!item||collectionMode(item)!=="shared_fields")return Response.json({error:"권한이 없거나 요청을 찾을 수 없습니다."},{status:404});const bytes=applySharedFieldValues(new Uint8Array(await readStored(item.templateStorageKey)),item.sharedFields??[],item.sharedFieldStates??[],false),name=safeFileName(`${item.title}_최종취합본_${timestamp()}.hwpx`);return new Response(Buffer.from(bytes),{headers:{"Content-Type":"application/vnd.hancom.hwpx","Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,"Cache-Control":"private, no-store"}})}catch(error){console.error(error);return Response.json({error:"최종 취합본을 만들지 못했습니다."},{status:500})}
}
function timestamp(){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date()),get=(type:Intl.DateTimeFormatPartTypes)=>parts.find(part=>part.type===type)?.value??"";return `${get("year")}${get("month")}${get("day")}_${get("hour")}${get("minute")}`}
