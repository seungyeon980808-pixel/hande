import { findByShareHash } from "@/lib/repository";
import { readStored } from "@/lib/files";
import { tokenHash } from "@/lib/security";

/** 담당자가 함께 올린 작년 참고 문서를 내려준다. */
export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){
  try{
    const {token}=await params;
    const item=await findByShareHash(tokenHash(token));
    if(!item)return Response.json({error:"유효하지 않은 제출 링크입니다."},{status:404});
    if(!item.reference)return Response.json({error:"함께 올린 작년 자료가 없습니다."},{status:404});
    const teacherId=new URL(request.url).searchParams.get("teacherId");
    if(!item.recipients.some(r=>r.id===teacherId))return Response.json({error:"제출 대상자를 확인할 수 없습니다."},{status:403});
    const bytes=new Uint8Array(await readStored(item.reference.storageKey));
    return new Response(bytes,{headers:{
      "Content-Type":"application/octet-stream",
      "Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(item.reference.name)}`,
      "X-Document-Name":encodeURIComponent(item.reference.name),
      "Cache-Control":"no-store",
    }});
  }catch(error){
    console.error(error);
    return Response.json({error:"작년 자료를 여는 중 오류가 발생했습니다."},{status:500});
  }
}
