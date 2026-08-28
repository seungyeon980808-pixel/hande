import path from "node:path";
import { extractNamedFields } from "@/lib/shared-fields";
import { MAX_FILE_BYTES } from "@/lib/files";

export async function POST(request:Request){
  try{
    const file=(await request.formData()).get("template");
    if(!(file instanceof File)||file.size===0)return Response.json({error:"HWPX 양식을 선택하세요."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"지정 필드 공동작성은 HWPX 양식만 지원합니다."},{status:400});
    if(file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});
    const fields=extractNamedFields(new Uint8Array(await file.arrayBuffer()));
    return Response.json({fields});
  }catch(error){
    console.error(error);
    return Response.json({error:error instanceof Error?error.message:"HWPX 필드를 읽지 못했습니다."},{status:400});
  }
}
