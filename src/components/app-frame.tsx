import Link from "next/link";

type NavItem={label:string;href:string;children?:{label:string;href:string}[]};

const nav:NavItem[]=[
  {label:"통합 대시보드",href:"#"},
  {label:"시간표",href:"/timetable"},
  {label:"업무 취합",href:"/",children:[
    {label:"올해 양식 만들기",href:"/prepare"},
    {label:"새 취합 요청",href:"/requests/new"},
  ]},
  {label:"나의 툴박스",href:"/tools"},
  {label:"자료실",href:"#"},
  {label:"업무 매뉴얼",href:"/manuals"},
];

/** 하위 메뉴가 있는 항목은 자신이나 자식이 열려 있을 때 펼쳐 둔다. */
const isOpen=(item:NavItem,active:string)=>item.label===active||Boolean(item.children?.some(child=>child.label===active));

export function AppFrame({children,active="업무 취합"}:{children:React.ReactNode;active?:string}){
  return <div className="app-shell">
    <div className="layout">
      <aside className="sidebar">
        <Link href="#" className="brand" style={{display:"block",textDecoration:"none"}}>
          수합의 정석 <small>한글·엑셀 파일 자동 취합</small>
        </Link>
        <div className="nav-label">업무 메뉴</div>
        {nav.map(item=><div key={item.label} className="nav-group">
          <Link className={`nav-item ${item.label===active?"active":""}`} href={item.href}>{item.label}</Link>
          {item.children&&isOpen(item,active)&&<div className="nav-children">
            {item.children.map(child=><Link key={child.label} className={`nav-item nav-child ${child.label===active?"active":""}`} href={child.href}>{child.label}</Link>)}
          </div>}
        </div>)}
      </aside>
      <main className="content">{children}</main>
    </div>
  </div>;
}
