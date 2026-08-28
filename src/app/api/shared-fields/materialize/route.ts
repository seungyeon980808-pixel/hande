import path from "node:path";
import { materializeSharedFieldMarkers } from "@/lib/shared-fields";
import { MAX_FILE_BYTES } from "@/lib/files";

export async function POST(request:Request){
  try{
    const file=(await request.formData()).get("template");
    if(!(file instanceof File)||file.size===0)return Response.json({error:"HWPX 양식을 선택하세요."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"작성 영역 지정은 HWPX 양식만 지원합니다."},{status:400});
    if(file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});
    const result=materializeSharedFieldMarkers(new Uint8Array(await file.arrayBuffer()));
    return new Response(new Blob([new Uint8Array(result.bytes).buffer]),{headers:{"Content-Type":"application/vnd.hancom.hwpx","X-Converted-Fields":String(result.converted)}});
  }catch(error){
    console.error(error);
    return Response.json({error:error instanceof Error?error.message:"작성 영역을 변환하지 못했습니다."},{status:400});
  }
}
