/**
 * 서버와 브라우저가 항상 같은 글자를 만들도록 직접 조립한다.
 * toLocaleString("ko-KR")은 서버에 한국어 데이터가 없으면 "오후" 대신 "PM"을 내어
 * hydration 오류를 일으킨다.
 */
const PARTS=new Intl.DateTimeFormat("en-US",{
  timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",
  hour:"2-digit",minute:"2-digit",hour12:false,
});

function pick(value:Date){
  const map:Record<string,string>={};
  for(const part of PARTS.formatToParts(value))map[part.type]=part.value;
  return map;
}

/** 2026년 3월 15일 14:30 */
export function formatDateTime(value:string|Date){
  const date=value instanceof Date?value:new Date(value);
  if(Number.isNaN(date.getTime()))return "-";
  const p=pick(date);
  return `${p.year}년 ${Number(p.month)}월 ${Number(p.day)}일 ${p.hour}:${p.minute}`;
}

/** 14:30 */
export function formatTime(value:string|Date){
  const date=value instanceof Date?value:new Date(value);
  if(Number.isNaN(date.getTime()))return "-";
  const p=pick(date);
  return `${p.hour}:${p.minute}`;
}
