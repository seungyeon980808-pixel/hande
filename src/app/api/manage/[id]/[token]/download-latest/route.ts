import { zipSync } from "fflate";
import { collectionType } from "@/lib/domain";
import { readStored } from "@/lib/files";
import { findManaged } from "@/lib/repository";
import { safeFileName,tokenHash } from "@/lib/security";

export async function GET(_request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{
    const {id,token}=await params,item=await findManaged(id,tokenHash(token));
    if(!item||collectionType(item)!=="xlsx")return Response.json({error:"권한이 없거나 엑셀 파일 취합 요청이 아닙니다."},{status:404});
    const files:Record<string,Uint8Array>={};
    for(const recipient of item.recipients){
      const latest=[...recipient.versions].reverse().find(version=>version.kind!=="table"&&version.storageKey);
      if(!latest)continue;
      files[safeFileName(`${recipient.name}_${recipient.department}_v${latest.version}.xlsx`)]=new Uint8Array(await readStored(latest.storageKey));
    }
    if(Object.keys(files).length===0)return Response.json({error:"아직 제출된 엑셀 파일이 없습니다."},{status:404});
    const bytes=zipSync(files,{level:6}),name=safeFileName(`${item.title}_최신제출.zip`);
    return new Response(bytes,{headers:{"Content-Type":"application/zip","Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,"Cache-Control":"private, no-store"}});
  }catch(error){console.error(error);return Response.json({error:"제출 파일 묶음을 만들지 못했습니다."},{status:500})}
}
