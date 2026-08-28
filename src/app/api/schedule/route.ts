import { getSchoolSchedule,NeisConfigurationError } from "@/lib/neis";

export const dynamic="force-dynamic";

/** 날짜를 정할 때 참고할 학사일정을 돌려준다. */
export async function GET(request:Request){
  try{
    const url=new URL(request.url);
    const from=url.searchParams.get("from")||"";
    const to=url.searchParams.get("to")||"";
    if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to))return Response.json({error:"기간을 확인할 수 없습니다."},{status:400});
    return Response.json({events:await getSchoolSchedule({from,to})});
  }catch(error){
    if(error instanceof NeisConfigurationError)return Response.json({error:error.message,configured:false},{status:503});
    console.error(error);
    return Response.json({error:"학사일정을 불러오지 못했습니다."},{status:502});
  }
}
