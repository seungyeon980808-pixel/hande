export type TimetableEntry={
  date:string;
  academicYear:string;
  semester:string;
  grade:string;
  className:string;
  period:number;
  subject:string;
  loadedAt:string;
};

export type TimetableResult={
  schoolName:string;
  educationOfficeName:string;
  entries:TimetableEntry[];
  loadedAt:string|null;
};

type JsonRecord=Record<string,unknown>;

export class NeisResponseError extends Error{
  constructor(public readonly code:string,message:string){super(message);this.name="NeisResponseError"}
}

const isRecord=(value:unknown):value is JsonRecord=>typeof value==="object"&&value!==null&&!Array.isArray(value);
const textValue=(value:unknown)=>typeof value==="string"?value:"";
const apiResult=(value:unknown)=>isRecord(value)&&typeof value.CODE==="string"&&typeof value.MESSAGE==="string"?{code:value.CODE,message:value.MESSAGE}:null;

export function parseNeisTimetable(payload:unknown):TimetableResult{
  if(!isRecord(payload))throw new NeisResponseError("INVALID_RESPONSE","나이스 응답 형식을 확인할 수 없습니다.");
  const topResult=apiResult(payload.RESULT);
  if(topResult){
    if(topResult.code==="INFO-200")return {schoolName:"학교 정보 없음",educationOfficeName:"교육청 정보 없음",entries:[],loadedAt:null};
    throw new NeisResponseError(topResult.code,topResult.message);
  }
  const sections=payload.misTimetable;
  if(!Array.isArray(sections))throw new NeisResponseError("INVALID_RESPONSE","나이스 시간표 응답이 없습니다.");
  const rowSection=sections.find(section=>isRecord(section)&&Array.isArray(section.row));
  if(!isRecord(rowSection)||!Array.isArray(rowSection.row))return {schoolName:"학교 정보 없음",educationOfficeName:"교육청 정보 없음",entries:[],loadedAt:null};
  const entries=rowSection.row.map((value,index)=>{
    if(!isRecord(value))throw new NeisResponseError("INVALID_ROW",`${index+1}번째 시간표 항목이 올바르지 않습니다.`);
    const rawDate=textValue(value.ALL_TI_YMD),period=Number(value.PERIO);
    if(!/^\d{8}$/.test(rawDate)||!Number.isInteger(period)||period<1)throw new NeisResponseError("INVALID_ROW",`${index+1}번째 시간표 항목이 올바르지 않습니다.`);
    return {
      date:`${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`,
      academicYear:textValue(value.AY),semester:textValue(value.SEM),grade:textValue(value.GRADE),className:textValue(value.CLASS_NM),period,
      subject:textValue(value.ITRT_CNTNT)||"수업 정보 없음",loadedAt:textValue(value.LOAD_DTM),
    };
  }).sort((left,right)=>left.date.localeCompare(right.date)||left.period-right.period);
  return {
    schoolName:textValue((rowSection.row[0] as JsonRecord|undefined)?.SCHUL_NM)||"학교 정보 없음",
    educationOfficeName:textValue((rowSection.row[0] as JsonRecord|undefined)?.ATPT_OFCDC_SC_NM)||"교육청 정보 없음",
    loadedAt:entries.map(entry=>entry.loadedAt).filter(Boolean).sort().at(-1)??null,
    entries,
  };
}
