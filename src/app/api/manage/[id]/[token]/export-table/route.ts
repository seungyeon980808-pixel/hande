import { collectionType } from "@/lib/domain";
import { findManaged } from "@/lib/repository";
import { safeFileName,tokenHash } from "@/lib/security";
import { createTableWorkbook } from "@/lib/xlsx";

export async function GET(_request:Request,{params}:{params:Promise<{id:string;token:string}>}){
  try{
    const {id,token}=await params,item=await findManaged(id,tokenHash(token));
    if(!item||collectionType(item)!=="table")return Response.json({error:"권한이 없거나 표 취합 요청이 아닙니다."},{status:404});
    const bytes=await createTableWorkbook(item),name=safeFileName(`${item.title}_전체취합.xlsx`);
    return new Response(new Uint8Array(bytes),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,"Cache-Control":"private, no-store"}});
  }catch(error){console.error(error);return Response.json({error:"통합 엑셀을 만들지 못했습니다."},{status:500})}
}
