import { AppFrame } from "@/components/app-frame";
import { Toolbox } from "@/components/toolbox";

export default function ToolsPage(){return <AppFrame active="나의 툴박스"><div className="page-head"><div><h1>나의 툴박스</h1><p className="subtle">자주 사용하는 수업·업무 사이트를 한곳에 모아 바로 실행합니다.</p></div><span className="badge badge-type">이 브라우저에 저장</span></div><Toolbox/></AppFrame>}
