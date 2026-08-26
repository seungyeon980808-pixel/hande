export const toolCategories=["전체","수업","콘텐츠","업무","기타"] as const;
export const toolTones=["mint","blue","purple","coral","yellow"] as const;

export type ToolCategory=(typeof toolCategories)[number];
export type ToolTone=(typeof toolTones)[number];
export type TeacherTool={id:string;name:string;detail:string;url:string;category:Exclude<ToolCategory,"전체">;image?:string;tone:ToolTone};

export const defaultTools:TeacherTool[]=[
  {id:"classroom",name:"Google 클래스룸",detail:"수업과 과제 관리",url:"https://classroom.google.com",category:"수업",tone:"mint"},
  {id:"ebs",name:"EBS 온라인클래스",detail:"온라인 수업 자료",url:"https://ebsoc.co.kr",category:"수업",tone:"blue"},
  {id:"canva",name:"Canva for Education",detail:"수업 자료 디자인",url:"https://www.canva.com/education/",category:"콘텐츠",tone:"purple"},
  {id:"padlet",name:"Padlet",detail:"생각과 자료 공유",url:"https://padlet.com",category:"콘텐츠",tone:"coral"},
];

export function normalizeToolUrl(value:string){
  const candidate=/^https?:\/\//i.test(value.trim())?value.trim():`https://${value.trim()}`;
  const parsed=new URL(candidate);
  if(!["http:","https:"].includes(parsed.protocol))throw new Error("웹사이트 주소만 등록할 수 있습니다.");
  return parsed.toString();
}

export function filterTools(tools:TeacherTool[],query:string,category:ToolCategory){
  const keyword=query.trim().toLocaleLowerCase("ko-KR");
  return tools.filter(tool=>(category==="전체"||tool.category===category)&&(!keyword||`${tool.name} ${tool.detail}`.toLocaleLowerCase("ko-KR").includes(keyword)));
}

export function parseStoredTools(value:string|null){
  if(!value)return defaultTools;
  try{
    const parsed:unknown=JSON.parse(value);
    if(!Array.isArray(parsed))return defaultTools;
    const tools=parsed.filter((item):item is TeacherTool=>{
      if(!item||typeof item!=="object")return false;
      const tool=item as Partial<TeacherTool>;
      return typeof tool.id==="string"&&typeof tool.name==="string"&&typeof tool.detail==="string"&&typeof tool.url==="string"&&toolCategories.slice(1).includes(tool.category as TeacherTool["category"])&&toolTones.includes(tool.tone as ToolTone)&&(tool.image===undefined||typeof tool.image==="string");
    });
    return tools.length===parsed.length?tools:defaultTools;
  }catch{return defaultTools}
}
