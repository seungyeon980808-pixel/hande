import path from "node:path";
import { z } from "zod";
import { MAX_FILE_BYTES } from "@/lib/files";
import { applySuggestions,detectPrepItems,extractText,renameBySuggestions } from "@/lib/refresh";
import { safeFileName } from "@/lib/security";
import { resolveTargetYear } from "@/lib/school-year";

export const dynamic="force-dynamic";

const schema=z.array(z.object({from:z.string().min(1),to:z.string()})).min(1).max(300);

/**
 * 작년 완성본 하나로 올해 양식을 만든다.
 * 승인 목록 없이 부르면 다룰 항목을 돌려주고, 함께 보내면 완성된 파일을 돌려준다.
 * 연도·회차는 바꾸고 날짜·이름은 비우는 일을 한 번에 처리한다.
 */
export async function POST(request:Request){
  try{
    const form=await request.formData();
    const file=form.get("document");
    if(!(file instanceof File))return Response.json({error:"작년 문서가 없습니다."},{status:400});
    if(path.extname(file.name).toLowerCase()!==".hwpx")return Response.json({error:"HWPX 파일만 다룰 수 있습니다. 한글에서 hwpx로 저장해 주세요."},{status:400});
    if(file.size<=0||file.size>MAX_FILE_BYTES)return Response.json({error:"파일 크기는 20MB 이하여야 합니다."},{status:400});
    const bytes=new Uint8Array(await file.arrayBuffer());

    const targetYear=resolveTargetYear(form.get("targetYear"));

    const raw=form.get("accepted");
    if(raw===null){
      let text:string;
      try{text=extractText(bytes)}
      catch{return Response.json({error:"한글 문서를 열지 못했습니다. 손상되었거나 지원하지 않는 형식입니다."},{status:400})}
      if(!text)return Response.json({error:"문서에서 글자를 찾지 못했습니다."},{status:400});
      const found=detectPrepItems(text,targetYear);
      return Response.json({items:found.items,sourceYear:found.sourceYear,targetYear});
    }

    let accepted;
    try{accepted=schema.parse(JSON.parse(String(raw)))}
    catch{return Response.json({error:"적용할 항목을 확인하지 못했습니다."},{status:400})}

    let result:Uint8Array;
    try{result=applySuggestions(bytes,accepted)}
    catch{return Response.json({error:"양식을 만들지 못했습니다. 손상된 파일일 수 있습니다."},{status:400})}

    // 파일 이름의 연도도 올해로 바꾼다.
    // "B_2025_졸업고사일정" 처럼 숫자만 있는 연도는 본문 치환 목록에 없으므로
    // 문서에서 찾아낸 작년 연도를 직접 바꾸고, 그래도 안 바뀌면 뒤에 덧붙인다.
    const renames=accepted.filter(pair=>pair.to);
    const original=path.basename(file.name,path.extname(file.name));
    let base=renameBySuggestions(original,renames);
    const sourceYear=detectPrepItems(extractText(bytes),targetYear).sourceYear;
    if(sourceYear!==targetYear)base=base.replaceAll(String(sourceYear),String(targetYear));
    const name=safeFileName(base.includes(String(targetYear))?`${base}.hwpx`:`${base}_${targetYear}학년도.hwpx`);
    return new Response(new Uint8Array(result),{headers:{
      "Content-Type":"application/vnd.hancom.hwpx",
      "Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "X-Document-Name":encodeURIComponent(name),
      "Cache-Control":"no-store",
    }});
  }catch(error){
    console.error(error);
    return Response.json({error:"양식을 만드는 중 오류가 발생했습니다."},{status:500});
  }
}
