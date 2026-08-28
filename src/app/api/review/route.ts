import path from "node:path";
import { MAX_FILE_BYTES } from "@/lib/files";
import { detectByRules,detectWarnings,extractText } from "@/lib/refresh";
import { geminiEnabled,reviewByAi } from "@/lib/gemini";

export const dynamic="force-dynamic";

/**
 * 문서를 읽고 사람이 확인할 지점을 짚어 준다. 고치지는 않는다.
 * before = 작성 전 (작년 문서를 보고 무엇을 바꿔야 하는지)
 * final  = 제출 전 (작년 내용이 남았거나 빈칸이 있는지)
 */
export async function POST(request:Request){
  try{
    const form=await request.formData();
    const file=form.get("document");
    const mode=String(form.get("mode")||"final")==="before"?"before":"final";
    if(!(file instanceof File))return Response.json({error:"검토할 문서가 없습니다."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"HWPX 파일만 검토할 수 있습니다. 한글에서 hwpx로 저장해 주세요."},{status:400});
    if(file.size<=0||file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});

    const parsedYear=Number(form.get("targetYear"));
    const targetYear=Number.isInteger(parsedYear)&&parsedYear>2000&&parsedYear<2100?parsedYear:new Date().getFullYear()+1;

    let text:string;
    try{text=extractText(new Uint8Array(await file.arrayBuffer()))}
    catch{return Response.json({error:"한글 문서를 열지 못했습니다. 손상되었거나 지원하지 않는 형식입니다."},{status:400})}
    if(!text)return Response.json({error:"문서에서 글자를 찾지 못했습니다."},{status:400});

    // AI가 없어도 규칙으로 확인할 거리는 만들어 준다.
    const leftovers=detectByRules(text,targetYear);
    const warnings=detectWarnings(text,targetYear);
    const ai=await reviewByAi(mode,text,targetYear);

    return Response.json({
      mode,targetYear,
      notes:ai.notes,
      leftovers:leftovers.map(item=>({id:item.id,text:item.from,to:item.to,count:item.count,
        hint:mode==="final"?`작년 표기가 그대로 남아 있습니다. ${item.to}로 고치세요.`:`올해 문서에서는 ${item.to}로 바꿔야 합니다.`})),
      warnings,
      aiEnabled:geminiEnabled(),
      aiError:ai.error,
    });
  }catch(error){
    console.error(error);
    return Response.json({error:"검토 중 오류가 발생했습니다."},{status:500});
  }
}
