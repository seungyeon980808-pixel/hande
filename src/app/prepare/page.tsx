import { AppFrame } from "@/components/app-frame";
import { PrepareClient } from "@/components/prepare-client";
import { DEFAULT_TARGET_YEAR } from "@/lib/school-year";

export const dynamic="force-dynamic";

export default function PreparePage(){
  return <AppFrame active="올해 양식 만들기">
    <div className="page-head"><div>
      <h1>작년 문서로 올해 양식 만들기</h1>
      <p className="subtle">작년 완성본을 올리면 연도와 회차는 올해 값으로 바꾸고, 날짜와 담당자 이름은 비워 배부할 양식을 만듭니다.</p>
    </div></div>
    <PrepareClient defaultYear={DEFAULT_TARGET_YEAR}/>
  </AppFrame>;
}
