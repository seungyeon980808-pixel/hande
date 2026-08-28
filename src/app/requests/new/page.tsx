import { AppFrame } from "@/components/app-frame";
import { RequestForm } from "@/components/request-form";
import { teachers } from "@/lib/domain";
export default function NewRequest(){return <AppFrame active="새 취합 요청"><div className="page-head"><div><h1>새 취합 요청</h1><p className="subtle">한글 문서, 웹 표, 엑셀 파일 중 필요한 방식을 선택하세요.</p></div></div><RequestForm teachers={teachers}/></AppFrame>}
