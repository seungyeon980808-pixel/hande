import { AppFrame } from "@/components/app-frame";
import { TimetableView } from "@/components/timetable-view";

export default function TimetablePage(){return <AppFrame active="시간표"><div className="page-head"><div><h1>우리 학교 시간표</h1><p className="subtle">설정한 학교의 학년·반별 최신 시간표를 나이스에서 확인합니다.</p></div><span className="badge badge-open">나이스 연동</span></div><TimetableView/></AppFrame>}
