import { randomUUID } from "node:crypto";
import { z } from "zod";
import { teachers,type CollectionType } from "@/lib/domain";
import { deleteStored,storeFile,storeSpreadsheet } from "@/lib/files";
import { saveCollection } from "@/lib/repository";
import { newToken,tokenHash,safeFileName } from "@/lib/security";
import { parseTableDefinition } from "@/lib/table";

const schema=z.object({
  type:z.enum(["document","table","xlsx"]),
  title:z.string().trim().min(2).max(80),
  description:z.string().trim().max(500),
  deadline:z.coerce.date().refine(date=>date.getTime()>Date.now(),"마감일은 현재 이후여야 합니다."),
  recipientIds:z.array(z.string()).min(1,"제출 대상을 한 명 이상 선택하세요."),
  // 몇 학년도용 문서인지. AI 검토와 갱신 제안이 이 값을 기준으로 판단한다.
  targetYear:z.coerce.number().int().min(2000).max(2099),
});

export async function POST(request:Request){
  let pendingStorageKey="";
  let pendingReferenceKey="";
  try{
    const form=await request.formData();
    const parsed=schema.safeParse({type:form.get("type"),title:form.get("title"),description:form.get("description")??"",deadline:form.get("deadline"),recipientIds:form.getAll("recipientIds"),targetYear:form.get("targetYear")||new Date().getFullYear()+1});
    if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message},{status:400});
    const chosen=teachers.filter(teacher=>parsed.data.recipientIds.includes(teacher.id));
    if(chosen.length!==new Set(parsed.data.recipientIds).size)return Response.json({error:"제출 대상 정보가 올바르지 않습니다."},{status:400});

    const type=parsed.data.type as CollectionType;
    let templateStorageKey="",templateName="",templateSize=0;
    // 작년(또는 재작년) 문서를 함께 올리면 제출 화면에서 좌우로 나란히 볼 수 있다.
    let reference:{storageKey:string;name:string;size:number}|undefined;
    let table;
    if(type==="table"){
      table=parseTableDefinition(String(form.get("tableColumns")||""),String(form.get("tableRows")||""));
    }else{
      const file=form.get("template");
      if(!(file instanceof File)||file.size===0)return Response.json({error:"양식 파일을 선택하세요."},{status:400});
      const stored=type==="xlsx"?await storeSpreadsheet(file):await storeFile(file);
      pendingStorageKey=stored.key;
      templateStorageKey=stored.key;
      templateName=safeFileName(file.name);
      templateSize=stored.size;
    }

    // 작년 참고 문서(선택). 한글 취합에서만 좌우 비교에 쓴다.
    const referenceFile=form.get("reference");
    if(type==="document"&&referenceFile instanceof File&&referenceFile.size>0){
      const stored=await storeFile(referenceFile);
      pendingReferenceKey=stored.key;
      reference={storageKey:stored.key,name:safeFileName(referenceFile.name),size:stored.size};
    }

    const id=randomUUID(),share=newToken(),manage=newToken();
    await saveCollection({
      id,type,title:parsed.data.title,description:parsed.data.description,deadline:parsed.data.deadline.toISOString(),
      shareTokenHash:tokenHash(share),manageTokenHash:tokenHash(manage),templateStorageKey,templateName,templateSize,targetYear:parsed.data.targetYear,reference,table,
      createdAt:new Date().toISOString(),recipients:chosen.map(teacher=>({...teacher,versions:[],drafts:[]})),
    });
    pendingStorageKey="";pendingReferenceKey="";
    const origin=new URL(request.url).origin;
    return Response.json({shareUrl:`${origin}/collect/${share}`,manageUrl:`${origin}/manage/${id}/${manage}`},{status:201});
  }catch(error){
    console.error(error);
    if(pendingStorageKey)await deleteStored(pendingStorageKey).catch(cleanupError=>console.error("요청 생성 실패 양식 정리 오류",cleanupError));
    if(pendingReferenceKey)await deleteStored(pendingReferenceKey).catch(cleanupError=>console.error("요청 생성 실패 참고자료 정리 오류",cleanupError));
    return Response.json({error:error instanceof Error?error.message:"요청 생성 중 오류가 발생했습니다."},{status:500});
  }
}
