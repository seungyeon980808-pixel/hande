import "server-only";
import { get } from "node:https";
import { parseNeisTimetable,type TimetableResult } from "./neis-data";

const endpoint="https://open.neis.go.kr/hub/misTimetable";

export class NeisConfigurationError extends Error{
  constructor(){super("나이스 API 환경변수가 설정되지 않았습니다. NEIS_API_KEY와 교육청·학교 코드를 확인해 주세요.");this.name="NeisConfigurationError"}
}

export async function getSchoolTimetable({date,grade,className}:{date:string;grade:string;className:string}):Promise<TimetableResult>{
  const key=process.env.NEIS_API_KEY?.trim(),educationOfficeCode=process.env.NEIS_ATPT_OFCDC_SC_CODE?.trim(),schoolCode=process.env.NEIS_SD_SCHUL_CODE?.trim();
  if(!key||!educationOfficeCode||!schoolCode)throw new NeisConfigurationError();
  const compactDate=date.replaceAll("-","");
  const params=new URLSearchParams({
    KEY:key,Type:"json",pIndex:"1",pSize:"100",
    ATPT_OFCDC_SC_CODE:educationOfficeCode,SD_SCHUL_CODE:schoolCode,
    ALL_TI_YMD:compactDate,GRADE:grade,CLASS_NM:className,
  });
  return parseNeisTimetable(await requestJson(`${endpoint}?${params}`));
}

function requestJson(url:string):Promise<unknown>{
  return new Promise((resolve,reject)=>{
    const request=get(url,{headers:{Accept:"*/*","Accept-Encoding":"identity","User-Agent":"school-work-collection/0.1"}},response=>{
      const chunks:Buffer[]=[];let size=0;
      response.on("data",(chunk:Buffer)=>{size+=chunk.length;if(size>2_000_000){request.destroy(new Error("나이스 응답 크기가 허용 범위를 넘었습니다."));return}chunks.push(chunk)});
      response.on("end",()=>{
        if(response.statusCode!==200){reject(new Error(`나이스 API가 HTTP ${response.statusCode??"오류"}로 응답했습니다.`));return}
        try{resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))}catch{reject(new Error("나이스 응답을 해석하지 못했습니다."))}
      });
    });
    request.setTimeout(8_000,()=>request.destroy(new Error("나이스 API 응답 시간이 초과되었습니다.")));
    request.on("error",reject);
  });
}

const scheduleEndpoint="https://open.neis.go.kr/hub/SchoolSchedule";

export type SchoolEvent={date:string;name:string;weekday:string};

const WEEKDAY=["일","월","화","수","목","금","토"];

/**
 * 나이스에서 학사일정을 가져온다.
 * 날짜를 정할 때 실제 요일과 학교 행사를 함께 보기 위한 것이다.
 */
export async function getSchoolSchedule({from,to}:{from:string;to:string}):Promise<SchoolEvent[]>{
  const key=process.env.NEIS_API_KEY?.trim(),educationOfficeCode=process.env.NEIS_ATPT_OFCDC_SC_CODE?.trim(),schoolCode=process.env.NEIS_SD_SCHUL_CODE?.trim();
  if(!key||!educationOfficeCode||!schoolCode)throw new NeisConfigurationError();
  const params=new URLSearchParams({
    KEY:key,Type:"json",pIndex:"1",pSize:"500",
    ATPT_OFCDC_SC_CODE:educationOfficeCode,SD_SCHUL_CODE:schoolCode,
    AA_FROM_YMD:from.replaceAll("-",""),AA_TO_YMD:to.replaceAll("-",""),
  });
  const body=await requestJson(`${scheduleEndpoint}?${params}`) as Record<string,unknown>;
  // 일정이 하나도 없으면 RESULT 로만 응답한다. 오류가 아니므로 빈 배열을 돌려준다.
  if(!Array.isArray(body?.SchoolSchedule))return [];
  const rows=(body.SchoolSchedule as Record<string,unknown>[])[1]?.row;
  if(!Array.isArray(rows))return [];
  const events:SchoolEvent[]=[];
  for(const row of rows as Record<string,string>[]){
    const raw=String(row.AA_YMD||"");
    const name=String(row.EVENT_NM||"").trim();
    if(!/^\d{8}$/.test(raw)||!name)continue;
    const date=`${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
    const day=new Date(Number(raw.slice(0,4)),Number(raw.slice(4,6))-1,Number(raw.slice(6,8)));
    events.push({date,name,weekday:WEEKDAY[day.getDay()]});
  }
  return events;
}
