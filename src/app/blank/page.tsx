import { AppFrame } from "@/components/app-frame";
import { BlankClient } from "@/components/blank-client";

export const dynamic="force-dynamic";

export default function BlankPage(){
  return <AppFrame active="빈 양식 만들기">
    <div className="page-head"><div>
      <h1>작년 문서로 빈 양식 만들기</h1>
      <p className="subtle">작년 완성본에서 해마다 다시 쓰는 값만 지워 올해 배부할 빈 양식을 만듭니다. 표와 항목 이름은 그대로 남습니다.</p>
    </div></div>
    <BlankClient/>
  </AppFrame>;
}
