import "server-only";
import type { Suggestion } from "./refresh";

const ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models";
const MODEL=process.env.GEMINI_MODEL||"gemini-2.5-flash";
const TIMEOUT_MS=20_000;
/** 문서가 길어도 토큰과 응답 시간을 안정적으로 유지하기 위한 상한 */
const MAX_CHARS=12_000;

export const geminiEnabled=()=>Boolean(process.env.GEMINI_API_KEY);

const RESPONSE_SCHEMA={
  type:"object",
  properties:{
    suggestions:{
      type:"array",
      items:{
        type:"object",
        properties:{
          from:{type:"string"},
          to:{type:"string"},
          reason:{type:"string"},
        },
        required:["from","to","reason"],
      },
    },
  },
  required:["suggestions"],
} as const;

function prompt(text:string,targetYear:number){
  return `너는 학교 공문서 담당자를 돕는 도우미다. 아래는 작년에 쓰던 한글 문서에서 뽑아낸 글자다.
이 문서를 ${targetYear}학년도용으로 다시 쓰려고 한다. 바꿔야 할 곳을 찾아라.

규칙:
- "from"에는 문서에 **정확히 그대로 들어있는** 글자만 적어라. 지어내지 마라.
- "from"은 문서에서 그 부분만 정확히 가리킬 수 있을 만큼 충분히 길게 잡아라.
- 연도, 학년도, 학기, 회차, 기수처럼 해가 바뀌면 달라지는 값에 집중해라.
- 날짜(3월 15일 같은 것)는 제안하지 마라. 해가 바뀌면 요일이 달라져 사람이 직접 정해야 하며, 별도로 안내하고 있다.
- 사람 이름이나 부서명은 바뀌었는지 확신할 수 없으면 제안하지 마라.
- 확실하지 않으면 제안하지 마라. 틀린 제안보다 적은 제안이 낫다.
- "reason"은 한국어 한 문장으로, 왜 바꿔야 하는지 쉽게 적어라.

문서 내용:
"""
${text.slice(0,MAX_CHARS)}
"""`;
}

/**
 * Gemini에게 갱신 후보를 물어본다.
 * 키가 없거나 호출이 실패하면 빈 배열을 돌려준다 — 규칙 기반 결과만으로 계속 동작한다.
 */
export async function suggestByAi(text:string,targetYear:number):Promise<{items:Suggestion[];error?:string}>{
  const key=process.env.GEMINI_API_KEY;
  if(!key)return {items:[]};
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
  try{
    const response=await fetch(`${ENDPOINT}/${MODEL}:generateContent`,{
      method:"POST",
      headers:{"content-type":"application/json","x-goog-api-key":key},
      signal:controller.signal,
      body:JSON.stringify({
        contents:[{parts:[{text:prompt(text,targetYear)}]}],
        generationConfig:{temperature:0,responseMimeType:"application/json",responseSchema:RESPONSE_SCHEMA},
      }),
    });
    if(!response.ok)return {items:[],error:`AI 호출 실패 (${response.status})`};
    const body=await response.json();
    const raw=body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if(typeof raw!=="string")return {items:[],error:"AI 응답을 이해하지 못했습니다."};
    const parsed=JSON.parse(raw);
    const list=Array.isArray(parsed?.suggestions)?parsed.suggestions:[];
    const items:Suggestion[]=[];
    for(const entry of list){
      const from=typeof entry?.from==="string"?entry.from:"";
      const to=typeof entry?.to==="string"?entry.to:"";
      const reason=typeof entry?.reason==="string"?entry.reason:"AI가 제안했습니다.";
      // AI가 지어낸 항목을 거르는 안전장치: 문서에 실제로 있는 글자만 통과시킨다.
      if(!from||from===to||!text.includes(from))continue;
      items.push({id:`ai:${from}`,from,to,reason,count:text.split(from).length-1,source:"ai"});
    }
    return {items};
  }catch(error){
    const aborted=error instanceof Error&&error.name==="AbortError";
    return {items:[],error:aborted?"AI 응답이 너무 오래 걸려 중단했습니다.":"AI 호출 중 오류가 발생했습니다."};
  }finally{clearTimeout(timer)}
}

/** 검토 결과 한 건. 자동으로 고치지 않고 사람에게 알려 주기만 한다. */
export type ReviewNote={id:string;level:"확인"|"주의";where:string;text:string;kind:"담당자"|"일정"|"연도"|"내용"};

const REVIEW_SCHEMA={
  type:"object",
  properties:{
    notes:{
      type:"array",
      items:{
        type:"object",
        properties:{
          level:{type:"string",enum:["확인","주의"]},
          kind:{type:"string",enum:["담당자","일정","연도","내용"]},
          where:{type:"string"},
          text:{type:"string"},
        },
        required:["level","kind","where","text"],
      },
    },
  },
  required:["notes"],
} as const;

function reviewPrompt(mode:"before"|"final",text:string,targetYear:number){
  const common=`너는 학교 공문서를 검토하는 도우미다. 한국어로 답하고, 각 항목은 한 문장으로 짧게 적어라.
- "where"에는 문서에 실제로 있는 글자를 짧게 인용해라. 지어내지 마라.
- "level"은 반드시 고쳐야 하면 "주의", 한 번 보기만 하면 되면 "확인"으로 적어라.
- "kind"는 사람 이름이나 담당자면 "담당자", 날짜나 기간이면 "일정", 연도·학년도면 "연도", 그 밖은 "내용"으로 적어라.
- 확실하지 않으면 적지 마라. 틀린 지적보다 적은 지적이 낫다.
- 최대 8개까지만 적어라.`;
  const job=mode==="before"
    ? `아래는 작년에 쓰던 문서다. 올해(${targetYear}학년도) 다시 작성할 때 무엇을 바꿔야 하는지 미리 알려 줘라.
해가 바뀌며 달라지는 값, 작년 상황에만 맞는 내용, 다시 정해야 할 일정에 집중해라.`
    : `아래는 방금 작성해 제출하려는 문서다. 제출 전에 걸러야 할 문제를 찾아라.
특히 작년 내용이 지워지지 않고 남았는지, 채우지 않은 빈칸이나 예시 문구가 남았는지, 앞뒤가 안 맞는 곳이 있는지 보아라.`;
  return `${common}

${job}

문서 내용:
"""
${text.slice(0,MAX_CHARS)}
"""`;
}

/** 문서를 읽고 사람이 확인할 지점을 짚어 준다. 고치지는 않는다. */
export async function reviewByAi(mode:"before"|"final",text:string,targetYear:number):Promise<{notes:ReviewNote[];error?:string}>{
  const key=process.env.GEMINI_API_KEY;
  if(!key)return {notes:[],error:"AI 키가 설정되어 있지 않습니다."};
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
  try{
    const response=await fetch(`${ENDPOINT}/${MODEL}:generateContent`,{
      method:"POST",
      headers:{"content-type":"application/json","x-goog-api-key":key},
      signal:controller.signal,
      body:JSON.stringify({
        contents:[{parts:[{text:reviewPrompt(mode,text,targetYear)}]}],
        generationConfig:{temperature:0,responseMimeType:"application/json",responseSchema:REVIEW_SCHEMA},
      }),
    });
    if(!response.ok)return {notes:[],error:`AI 호출 실패 (${response.status})`};
    const body=await response.json();
    const raw=body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if(typeof raw!=="string")return {notes:[],error:"AI 응답을 이해하지 못했습니다."};
    const list=JSON.parse(raw)?.notes;
    if(!Array.isArray(list))return {notes:[],error:"AI 응답을 이해하지 못했습니다."};
    const notes:ReviewNote[]=[];
    for(const [index,entry] of list.entries()){
      const where=typeof entry?.where==="string"?entry.where:"";
      const body=typeof entry?.text==="string"?entry.text:"";
      if(!body)continue;
      const kind=["담당자","일정","연도","내용"].includes(entry?.kind)?entry.kind:"내용";
      notes.push({id:`note:${index}`,level:entry?.level==="주의"?"주의":"확인",kind,where,text:body});
    }
    return {notes};
  }catch(error){
    const aborted=error instanceof Error&&error.name==="AbortError";
    return {notes:[],error:aborted?"AI 응답이 너무 오래 걸려 중단했습니다.":"AI 호출 중 오류가 발생했습니다."};
  }finally{clearTimeout(timer)}
}
