import { z } from "zod";
import { getSchoolTimetable,NeisConfigurationError } from "@/lib/neis";
import { NeisResponseError } from "@/lib/neis-data";

const querySchema=z.object({
  date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"날짜 형식이 올바르지 않습니다.").refine(value=>{const [year,month,day]=value.split("-").map(Number),date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day},"날짜가 올바르지 않습니다."),
  grade:z.enum(["1","2","3"]),
  className:z.coerce.number().int().min(1).max(30).transform(String),
});

export async function GET(request:Request){
  const url=new URL(request.url),parsed=querySchema.safeParse({date:url.searchParams.get("date"),grade:url.searchParams.get("grade"),className:url.searchParams.get("className")});
  if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||"조회 조건을 확인해 주세요."},{status:400,headers:{"Cache-Control":"private, no-store"}});
  try{
    const result=await getSchoolTimetable(parsed.data);
    return Response.json({...result,fetchedAt:new Date().toISOString()},{headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
  }catch(error){
    if(error instanceof NeisConfigurationError)return Response.json({error:error.message},{status:503,headers:{"Cache-Control":"private, no-store"}});
    if(error instanceof NeisResponseError)return Response.json({error:`나이스 조회 오류: ${error.message}`},{status:502,headers:{"Cache-Control":"private, no-store"}});
    console.error("나이스 시간표 조회 실패",error instanceof Error?error.message:"알 수 없는 오류");
    return Response.json({error:"나이스 시간표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."},{status:502,headers:{"Cache-Control":"private, no-store"}});
  }
}
