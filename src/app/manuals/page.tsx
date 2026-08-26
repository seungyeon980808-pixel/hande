import { AppFrame } from "@/components/app-frame";
import { ManualSearch } from "@/components/manual-search";
import { manuals } from "@/lib/manuals";

export default function ManualsPage(){return <AppFrame active="업무 매뉴얼"><div className="page-head"><div><h1>업무 매뉴얼</h1><p className="subtle">전화하기 전에 업무 표현을 그대로 검색해 보세요. 관련 절차를 한 화면에서 확인할 수 있습니다.</p></div></div><ManualSearch manuals={manuals}/></AppFrame>}
