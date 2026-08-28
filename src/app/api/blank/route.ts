import path from "node:path";
import { z } from "zod";
import { MAX_FILE_BYTES } from "@/lib/files";
import { blankOut,detectBlankTargets,extractText } from "@/lib/refresh";
import { safeFileName } from "@/lib/security";

export const dynamic="force-dynamic";

const schema=z.array(z.object({text:z.string().min(1)})).min(1).max(200);

/**
 * 작년 완성본에서 빈 양식을 만든다.
 * 목록만 요청하면 지울 후보를 돌려주고, 승인 목록을 함께 보내면 지운 파일을 돌려준다.
 */
export async function POST(request:Request){
  try{
    const form=await request.formData();
    const file=form.get("document");
    if(!(file instanceof File))return Response.json({error:"작년 문서가 없습니다."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"HWPX 파일만 빈 양식으로 만들 수 있습니다."},{status:400});
    if(file.size<=0||file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});
    const bytes=new Uint8Array(await file.arrayBuffer());

    const raw=form.get("accepted");
    if(raw===null){
      let text:string;
      try{text=extractText(bytes)}
      catch{return Response.json({error:"한글 문서를 열지 못했습니다."},{status:400})}
      if(!text)return Response.json({error:"문서에서 글자를 찾지 못했습니다."},{status:400});
      return Response.json({targets:detectBlankTargets(text)});
    }

    let accepted;
    try{accepted=schema.parse(JSON.parse(String(raw)))}
    catch{return Response.json({error:"비울 항목을 확인하지 못했습니다."},{status:400})}

    let result:Uint8Array;
    try{result=blankOut(bytes,accepted)}
    catch{return Response.json({error:"빈 양식을 만들지 못했습니다. 손상된 파일일 수 있습니다."},{status:400})}

    const base=path.basename(file.name,path.extname(file.name));
    const name=safeFileName(`${base}_빈양식.hwpx`);
    return new Response(new Uint8Array(result),{headers:{
      "Content-Type":"application/vnd.hancom.hwpx",
      "Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "X-Document-Name":encodeURIComponent(name),
      "Cache-Control":"no-store",
    }});
  }catch(error){
    console.error(error);
    return Response.json({error:"빈 양식을 만드는 중 오류가 발생했습니다."},{status:500});
  }
}
