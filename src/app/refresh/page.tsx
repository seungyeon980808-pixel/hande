import { AppFrame } from "@/components/app-frame";
import { RefreshClient } from "@/components/refresh-client";

export const dynamic="force-dynamic";

export default function RefreshPage(){
  return <AppFrame active="양식 갱신">
    <div className="page-head"><div>
      <h1>작년 양식 올해용으로 바꾸기</h1>
      <p className="subtle">작년 한글 양식을 올리면 바꿔야 할 곳을 찾아 드립니다. 확인한 항목만 한 번에 반영됩니다.</p>
    </div></div>
    <RefreshClient defaultYear={new Date().getFullYear()+1}/>
  </AppFrame>;
}
