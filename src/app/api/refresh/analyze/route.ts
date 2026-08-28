import path from "node:path";
import { MAX_FILE_BYTES } from "@/lib/files";
import { detectByRules,detectWarnings,extractText,type Suggestion } from "@/lib/refresh";
import { geminiEnabled,suggestByAi } from "@/lib/gemini";

export const dynamic="force-dynamic";

/** 작년 양식을 받아 올해용으로 바꿀 후보를 돌려준다. */
export async function POST(request:Request){
  try{
    const form=await request.formData();
    const file=form.get("document");
    if(!(file instanceof File))return Response.json({error:"양식 파일이 없습니다."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"HWPX 파일만 분석할 수 있습니다. 한글에서 hwpx로 저장해 주세요."},{status:400});
    if(file.size<=0||file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});

    const parsedYear=Number(form.get("targetYear"));
    const targetYear=Number.isInteger(parsedYear)&&parsedYear>2000&&parsedYear<2100?parsedYear:new Date().getFullYear()+1;

    let text:string;
    try{text=extractText(new Uint8Array(await file.arrayBuffer()))}
    catch{return Response.json({error:"한글 문서를 열지 못했습니다. 손상되었거나 지원하지 않는 형식입니다."},{status:400})}
    if(!text)return Response.json({error:"문서에서 글자를 찾지 못했습니다."},{status:400});

    const rules=detectByRules(text,targetYear);
    const warnings=detectWarnings(text,targetYear);
    const ai=await suggestByAi(text,targetYear);

    // 규칙 결과를 우선하고, AI 제안이 규칙과 겹치면 버린다.
    // 글자가 똑같은 경우뿐 아니라 "2024~2025" 와 "2024~2025 학년도" 처럼
    // 한쪽이 다른 쪽을 품는 경우도 같은 곳을 두 번 보여주게 되므로 함께 제외한다.
    const merged:Suggestion[]=[...rules];
    for(const item of ai.items){
      if(merged.some(kept=>kept.from.includes(item.from)||item.from.includes(kept.from)))continue;
      merged.push(item);
    }

    return Response.json({
      suggestions:merged,
      warnings,
      targetYear,
      aiEnabled:geminiEnabled(),
      aiError:ai.error,
      textLength:text.length,
    });
  }catch(error){
    console.error(error);
    return Response.json({error:"분석 중 오류가 발생했습니다."},{status:500});
  }
}
