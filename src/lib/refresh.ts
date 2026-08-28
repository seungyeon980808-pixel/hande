import { strFromU8,strToU8,unzipSync,zipSync } from "fflate";

/** 작년 양식에서 올해용으로 바꿔야 할 후보 한 건. */
export type Suggestion={
  id:string;
  /** 문서에 실제로 들어있는 원본 글자 */
  from:string;
  /** 바꿔 넣을 글자 */
  to:string;
  /** 왜 바꿔야 하는지 (사용자에게 그대로 보여줌) */
  reason:string;
  /** 문서에 몇 번 나오는지 */
  count:number;
  /** rule=규칙으로 찾음, ai=AI가 찾음 */
  source:"rule"|"ai";
};

const XML_TAG=/<[^>]*>/g;

/** HWPX(zip) 안의 XML에서 사람이 읽는 글자만 뽑아낸다. */
export function extractText(source:Uint8Array):string{
  const files=unzipSync(source);
  const parts:string[]=[];
  for(const key of Object.keys(files).sort()){
    if(!key.startsWith("Contents/")||!key.endsWith(".xml"))continue;
    parts.push(strFromU8(files[key]).replace(XML_TAG," "));
  }
  return parts.join("\n")
    .replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&apos;","'")
    .replace(/[ \t ]+/g," ")
    .replace(/\n{2,}/g,"\n")
    .trim();
}

function countOccurrences(text:string,needle:string){
  if(!needle)return 0;
  let count=0,index=0;
  for(;;){const found=text.indexOf(needle,index);if(found<0)break;count++;index=found+needle.length}
  return count;
}

/**
 * 규칙만으로 찾는 후보. AI 없이도 시연이 되도록 하는 안전망이며,
 * AI를 쓸 때도 확실한 항목을 먼저 잡아 준다.
 */
const WEEKDAY=["일","월","화","수","목","금","토"];

/** 확인만 필요하고 자동으로 바꾸면 안 되는 항목 (날짜 등) */
export type Warning={id:string;text:string;detail:string};

/**
 * 규칙만으로 찾는 후보. AI 없이도 대표적인 항목은 잡아 준다.
 * 확실한 것만 바꾸고, 사람이 판단해야 하는 것은 warnings 로 따로 알린다.
 */
export function detectByRules(text:string,targetYear:number):Suggestion[]{
  const previous=targetYear-1;
  const found:Suggestion[]=[];
  const push=(from:string,to:string,reason:string)=>{
    const count=countOccurrences(text,from);
    if(count>0&&from!==to&&!found.some(s=>s.from===from))found.push({id:`rule:${from}`,from,to,reason,count,source:"rule"});
  };

  // 1) 학년도 · 연도 표기
  push(`${previous}학년도`,`${targetYear}학년도`,`작년 학년도입니다. ${targetYear}학년도로 바꿉니다.`);
  push(`${previous}년`,`${targetYear}년`,`작년 연도입니다. ${targetYear}년으로 바꿉니다.`);
  push(`${previous}.`,`${targetYear}.`,`작년 연도 표기입니다. ${targetYear}년으로 바꿉니다.`);

  // 2) 학년도 범위 (2024~2025 -> 2025~2026)
  for(const dash of ["~","-","–"]){
    push(`${previous-1}${dash}${previous}`,`${previous}${dash}${targetYear}`,`작년 기준 학년도 범위입니다. ${previous}${dash}${targetYear}로 바꿉니다.`);
  }

  // 3) 회차 · 기수 (제5회 -> 제6회)
  for(const [pattern,unit,label] of [[/제\s?(\d{1,3})\s?회/g,"회","회차"],[/제\s?(\d{1,3})\s?기/g,"기","기수"]] as const){
    for(const match of text.matchAll(pattern)){
      const number=Number(match[1]);
      if(!Number.isInteger(number)||number<1||number>999)continue;
      push(match[0],match[0].replace(String(number),String(number+1)),`해마다 올라가는 ${label}입니다. ${number+1}${unit}로 올립니다.`);
    }
  }

  // 4) 서기 연도가 단독으로 남은 경우 (위에서 안 잡힌 나머지)
  push(String(previous),String(targetYear),`작년 연도 숫자입니다. ${targetYear}로 바꿉니다.`);

  return found;
}

/**
 * 자동으로 바꾸면 위험해 사람이 직접 확인해야 하는 곳을 찾는다.
 * 날짜는 해가 바뀌면 요일이 달라지므로 숫자만 옮기면 주말 일정이 만들어진다.
 */
export function detectWarnings(text:string,targetYear:number):Warning[]{
  const previous=targetYear-1;
  const warnings:Warning[]=[];
  const seen=new Set<string>();

  const record=(raw:string,month:number,day:number)=>{
    if(seen.has(raw))return;
    if(month<1||month>12||day<1||day>31)return;
    const before=new Date(previous,month-1,day);
    const after=new Date(targetYear,month-1,day);
    if(before.getMonth()!==month-1||after.getMonth()!==month-1)return;
    seen.add(raw);
    const beforeDay=WEEKDAY[before.getDay()],afterDay=WEEKDAY[after.getDay()];
    warnings.push({
      id:`warn:${raw}`,
      text:raw,
      detail:beforeDay===afterDay
        ?`${previous}년에도 ${targetYear}년에도 ${afterDay}요일입니다. 일정이 맞는지만 확인하세요.`
        :`${previous}년에는 ${beforeDay}요일이었지만 ${targetYear}년에는 ${afterDay}요일입니다. 날짜를 다시 정해야 할 수 있습니다.`,
    });
  };

  // 3월 15일 / 3. 15. / 3/15 형태
  for(const match of text.matchAll(/(\d{1,2})\s?월\s?(\d{1,2})\s?일/g))record(match[0],Number(match[1]),Number(match[2]));
  for(const match of text.matchAll(/(?<![\d.])(\d{1,2})\s?[./]\s?(\d{1,2})(?![\d])/g))record(match[0],Number(match[1]),Number(match[2]));

  return warnings.slice(0,30);
}

/**
 * 한 번 바뀐 자리를 다른 규칙이 또 건드리지 않도록 한 번만 훑으며 치환한다.
 * 예) "2024~2025" 를 "2025~2026" 으로 바꾼 뒤 "2025"->"2026" 규칙이
 *     그 결과를 또 바꿔 "2026~2026" 이 되는 것을 막는다.
 * 긴 후보를 먼저 맞춰 보므로 "2025학년도"가 "2025"보다 우선한다.
 */
function replaceOnce(input:string,pairs:{from:string;to:string}[]){
  const ordered=[...pairs].sort((a,b)=>b.from.length-a.from.length);
  let out="",index=0;
  outer: while(index<input.length){
    for(const {from,to} of ordered){
      if(from&&input.startsWith(from,index)){out+=to;index+=from.length;continue outer}
    }
    out+=input[index];index++;
  }
  return out;
}

/** 후보를 실제로 문서에 반영한다. 원본 서식은 그대로 유지된다. */
export function applySuggestions(source:Uint8Array,suggestions:Pick<Suggestion,"from"|"to">[]):Uint8Array{
  const usable=suggestions.filter(s=>s.from&&s.from!==s.to);
  if(!usable.length)return source;
  const escaped=usable.map(({from,to})=>({from:escapeXml(from),to:escapeXml(to)}));
  const files=unzipSync(source);
  for(const [key,value] of Object.entries(files)){
    if(!key.endsWith(".xml"))continue;
    const xml=strFromU8(value);
    const next=replaceOnce(xml,escaped);
    if(next!==xml)files[key]=strToU8(next);
  }
  return zipSync(files,{level:6});
}

/**
 * 승인된 후보를 파일 이름에도 적용한다.
 * 파일명은 XML이 아니므로 이스케이프 없이 그대로 치환한다.
 * 문서 안만 바꾸면 `2025_계획.hwpx` 같은 이름이 그대로 남아 작년 파일과 헷갈린다.
 */
export function renameBySuggestions(baseName:string,suggestions:Pick<Suggestion,"from"|"to">[]){
  return replaceOnce(baseName,suggestions.filter(s=>s.from&&s.from!==s.to));
}

function escapeXml(value:string){return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;")}

/** 빈 양식을 만들 때 지울 후보 한 건. */
export type BlankTarget={id:string;text:string;kind:"날짜"|"연도"|"이름"|"숫자";count:number};

/**
 * 작년 완성본에서 "해마다 다시 쓰는 값"을 찾는다.
 * 표 구조와 항목명은 남기고, 채워 넣은 값만 비우기 위한 후보다.
 * 지우면 되돌릴 수 없으므로 반드시 담당자 확인을 거쳐야 한다.
 */
export function detectBlankTargets(text:string):BlankTarget[]{
  const found:BlankTarget[]=[];
  const seen=new Set<string>();
  const push=(raw:string,kind:BlankTarget["kind"])=>{
    const value=raw.trim();
    if(!value||seen.has(value))return;
    seen.add(value);
    found.push({id:`blank:${value}`,text:value,kind,count:countOccurrences(text,value)});
  };

  // 날짜: 4월 3일(수) / 4월 3일 / 4. 3.
  for(const match of text.matchAll(/\d{1,2}\s?월\s?\d{1,2}\s?일(\s?\([월화수목금토일]\))?(\s?~\s?\d{1,2}\s?일(\s?\([월화수목금토일]\))?)?/g))push(match[0],"날짜");
  // 연도·학년도
  for(const match of text.matchAll(/20\d{2}\s?(학년도|년도|년)?/g))push(match[0],"연도");
  // 사람 이름: 3글자 이름 뒤에 직위가 붙는 경우만. 업무 용어를 이름으로 잘못 잡지 않도록
  // 흔한 성으로 시작하는 세 글자만 인정하고, 업무 용어는 제외한다.
  const NOT_NAME=new Set(["담당교과","성적관리","학년부장","교육과정","생활지도"]);
  const SURNAME="김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남심노정하곽성차주우구신임나전민유진지엄채원천방공강";
  for(const match of text.matchAll(/[가-힣]{3}(?=\s{0,2}(선생님|교사|부장|위원|주무관|장학사))/g)){
    const name=match[0];
    if(NOT_NAME.has(name)||!SURNAME.includes(name[0]))continue;
    push(name,"이름");
  }

  return found.slice(0,60);
}

/** 승인한 값을 문서에서 지워 빈 양식을 만든다. 표와 항목명은 그대로 남는다. */
export function blankOut(source:Uint8Array,targets:{text:string}[]):Uint8Array{
  const usable=targets.filter(t=>t.text).map(t=>({from:escapeXml(t.text),to:""}));
  if(!usable.length)return source;
  const files=unzipSync(source);
  for(const [key,value] of Object.entries(files)){
    if(!key.endsWith(".xml"))continue;
    const xml=strFromU8(value);
    const next=replaceOnce(xml,usable);
    if(next!==xml)files[key]=strToU8(next);
  }
  return zipSync(files,{level:6});
}

/** 올해 양식을 만들 때 다룰 항목 한 건. */
export type PrepItem={
  id:string;
  /** 문서에 실제로 들어 있는 글자 */
  text:string;
  kind:"연도"|"회차"|"날짜"|"이름";
  count:number;
  /** 연도·회차처럼 바꿀 값이 정해진 경우의 후보들 (드롭다운) */
  options?:string[];
  /** 처음 고를 값. 날짜·이름은 빈 문자열(비움)이다. */
  suggested:string;
  /** 왜 이렇게 제안하는지 */
  reason:string;
};

/**
 * 작년 완성본 하나로 올해 양식을 만들기 위한 항목을 모두 찾는다.
 * 연도·회차는 바꿀 값을 고르게 하고, 날짜·이름은 비우기를 기본으로 한다.
 */
export function detectPrepItems(text:string,targetYear:number):PrepItem[]{
  const items:PrepItem[]=[];
  const seen=new Set<string>();
  const add=(item:PrepItem)=>{if(seen.has(item.text))return;seen.add(item.text);items.push(item)};

  // 문서에 실제로 있는 연도 중 가장 큰 값을 작년으로 본다.
  const years=[...text.matchAll(/(?<!\d)(20\d{2})(?!\d)/g)].map(match=>Number(match[1]));
  const source=years.length?Math.max(...years):targetYear-1;
  const shift=targetYear-source;

  for(const suffix of ["학년도","년도","년","."]){
    const from=`${source}${suffix}`;
    if(!text.includes(from))continue;
    add({id:`year:${from}`,text:from,kind:"연도",count:countOccurrences(text,from),
      options:[`${targetYear}${suffix}`,`${targetYear+1}${suffix}`,`${source}${suffix}`],
      suggested:`${targetYear}${suffix}`,
      reason:`${source}년 문서입니다. ${targetYear}년으로 바꿉니다.`});
  }
  if(text.includes(String(source))&&!items.some(item=>item.text.startsWith(String(source)))){
    add({id:`year:${source}`,text:String(source),kind:"연도",count:countOccurrences(text,String(source)),
      options:[String(targetYear),String(targetYear+1),String(source)],
      suggested:String(targetYear),
      reason:`${source}년 문서입니다. ${targetYear}년으로 바꿉니다.`});
  }

  // 회차·기수는 해가 넘어간 만큼 올린다.
  for(const [pattern,unit] of [[/제\s?(\d{1,3})\s?회/g,"회"],[/제\s?(\d{1,3})\s?기/g,"기"]] as const){
    for(const match of text.matchAll(pattern)){
      const current=Number(match[1]);
      if(!Number.isInteger(current)||current<1||current>999)continue;
      const next=current+Math.max(shift,1);
      const make=(value:number)=>match[0].replace(String(current),String(value));
      add({id:`count:${match[0]}`,text:match[0],kind:"회차",count:countOccurrences(text,match[0]),
        options:[make(next),make(current+1),match[0]],
        suggested:make(next),
        reason:`해마다 올라가는 ${unit}차입니다. ${next}${unit}로 올립니다.`});
    }
  }

  // 날짜는 요일이 달라지므로 비우고 새로 정하게 한다.
  // "4월 24일(수)" 뿐 아니라 학교 문서에 흔한 "4. 24.(수)" 형태도 함께 찾는다.
  const DATE=/\d{1,2}\s?월\s?\d{1,2}\s?일(\s?\([월화수목금토일]\))?(\s?~\s?\d{1,2}\s?일(\s?\([월화수목금토일]\))?)?|(?<![\d.])\d{1,2}\.\s?\d{1,2}\.(\s?\([월화수목금토일]\))?(\s?~\s?\d{1,2}\.\s?\d{1,2}\.(\s?\([월화수목금토일]\))?)?/g;
  for(const match of text.matchAll(DATE)){
    add({id:`date:${match[0]}`,text:match[0],kind:"날짜",count:countOccurrences(text,match[0]),
      suggested:"",reason:"해가 바뀌면 요일이 달라집니다. 비우고 새 학사일정에 맞춰 적으세요."});
  }

  // 담당자 이름
  const NOT_NAME=new Set(["담당교과","성적관리","학년부장","교육과정","생활지도"]);
  const SURNAME="김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남심노하곽성차주우구민진지엄채원천방공";
  for(const match of text.matchAll(/[가-힣]{3}(?=\s{0,2}(선생님|교사|부장|위원|주무관|장학사))/g)){
    const name=match[0];
    if(NOT_NAME.has(name)||!SURNAME.includes(name[0]))continue;
    add({id:`name:${name}`,text:name,kind:"이름",count:countOccurrences(text,name),
      suggested:"",reason:"담당자가 바뀌었다면 비우고, 그대로라면 체크를 해제하세요."});
  }

  return items;
}
