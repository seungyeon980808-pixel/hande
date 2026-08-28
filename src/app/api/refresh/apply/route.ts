import path from "node:path";
import { z } from "zod";
import { MAX_FILE_BYTES } from "@/lib/files";
import { applySuggestions,renameBySuggestions } from "@/lib/refresh";
import { safeFileName } from "@/lib/security";

export const dynamic="force-dynamic";

const schema=z.array(z.object({from:z.string().min(1),to:z.string()})).min(1).max(200);

/** 사용자가 승인한 후보만 원본 문서에 반영해 새 파일로 돌려준다. */
export async function POST(request:Request){
  try{
    const form=await request.formData();
    const file=form.get("document");
    if(!(file instanceof File))return Response.json({error:"양식 파일이 없습니다."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"HWPX 파일만 반영할 수 있습니다."},{status:400});
    if(file.size<=0||file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});

    let accepted;
    try{accepted=schema.parse(JSON.parse(String(form.get("accepted")||"[]")))}
    catch{return Response.json({error:"반영할 항목을 확인하지 못했습니다."},{status:400})}

    let bytes:Uint8Array;
    try{bytes=applySuggestions(new Uint8Array(await file.arrayBuffer()),accepted)}
    catch{return Response.json({error:"문서에 반영하지 못했습니다. 손상된 파일일 수 있습니다."},{status:400})}

    // 파일 이름에 남은 작년 연도도 같이 바꾼다 (2025_계획.hwpx -> 2026_계획_갱신본.hwpx)
    const base=renameBySuggestions(path.basename(file.name,path.extname(file.name)),accepted);
    const name=safeFileName(`${base}_갱신본.hwpx`);
    return new Response(new Uint8Array(bytes),{headers:{
      "Content-Type":"application/vnd.hancom.hwpx",
      "Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "X-Document-Name":encodeURIComponent(name),
      "Cache-Control":"no-store",
    }});
  }catch(error){
    console.error(error);
    return Response.json({error:"반영 중 오류가 발생했습니다."},{status:500});
  }
}
