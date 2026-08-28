import { describe,expect,it } from "vitest";
import { strFromU8,strToU8,unzipSync,zipSync } from "fflate";
import { applySuggestions,blankOut,detectBlankTargets,detectByRules,detectWarnings,extractText,renameBySuggestions } from "./refresh";

const build=(body:string)=>zipSync({
  "Contents/section0.xml":strToU8(body),
  "BinData/image.bin":new Uint8Array([1,2,3]),
});

describe("작년 양식 갱신",()=>{
  it("XML 태그를 걷어내고 본문 글자만 뽑는다",()=>{
    expect(extractText(build("<p><run>2025학년도</run> <run>운영 계획</run></p>"))).toBe("2025학년도 운영 계획");
  });

  it("본문 밖의 이미지 데이터는 읽지 않는다",()=>{
    const source=zipSync({
      "Contents/section0.xml":strToU8("<p>계획서</p>"),
      "BinData/note.bin":strToU8("숨은글자"),
      "settings.xml":strToU8("<x>설정값</x>"),
    });
    const text=extractText(source);
    expect(text).toBe("계획서");
    expect(text).not.toContain("숨은글자");
    expect(text).not.toContain("설정값");
  });

  it("작년 연도를 찾아 올해로 바꿀 후보를 만든다",()=>{
    const found=detectByRules("2025학년도 계획 · 2025년 3월",2026);
    expect(found.length).toBeGreaterThan(0);
    expect(found.every(s=>s.to.includes("2026"))).toBe(true);
    expect(found.every(s=>s.from!==s.to)).toBe(true);
    expect(found.some(s=>s.from==="2025학년도")).toBe(true);
  });

  it("문서에 없는 글자는 후보로 만들지 않는다",()=>{
    expect(detectByRules("올해 계획",2026)).toHaveLength(0);
  });

  it("승인한 항목만 반영하고 서식·이미지는 건드리지 않는다",()=>{
    const source=build("<p>2025학년도 계획</p>");
    const result=unzipSync(applySuggestions(source,[{from:"2025학년도",to:"2026학년도"}]));
    expect(strFromU8(result["Contents/section0.xml"])).toBe("<p>2026학년도 계획</p>");
    expect([...result["BinData/image.bin"]]).toEqual([1,2,3]);
  });

  it("반영할 항목이 없으면 원본을 그대로 둔다",()=>{
    const source=build("<p>2025년</p>");
    expect(applySuggestions(source,[])).toBe(source);
  });

  it("회차와 기수를 한 해 올린다",()=>{
    const found=detectByRules("제5회 대회 · 제12기 학생회",2026);
    expect(found.find(s=>s.from==="제5회")?.to).toBe("제6회");
    expect(found.find(s=>s.from==="제12기")?.to).toBe("제13기");
  });

  it("학년도 범위를 한 해 옮긴다",()=>{
    expect(detectByRules("2024~2025 학년도",2026).find(s=>s.from==="2024~2025")?.to).toBe("2025~2026");
  });

  it("이미 바꾼 자리를 다른 규칙이 또 바꾸지 않는다",()=>{
    const source=build("<p>2024~2025 학년도 2025년</p>");
    const result=unzipSync(applySuggestions(source,[
      {from:"2024~2025",to:"2025~2026"},
      {from:"2025년",to:"2026년"},
      {from:"2025",to:"2026"},
    ]));
    expect(strFromU8(result["Contents/section0.xml"])).toBe("<p>2025~2026 학년도 2026년</p>");
  });

  it("날짜는 바꾸지 않고 요일이 달라진다고 알려 준다",()=>{
    const warnings=detectWarnings("일시: 2025년 3월 15일",2026);
    const target=warnings.find(w=>w.text.includes("3월 15일"));
    expect(target).toBeDefined();
    expect(target?.detail).toContain("토요일");
    expect(target?.detail).toContain("일요일");
  });

  it("있을 수 없는 날짜는 알리지 않는다",()=>{
    expect(detectWarnings("13월 40일 접수",2026)).toHaveLength(0);
  });

  it("파일 이름에 남은 작년 연도도 바꾼다",()=>{
    expect(renameBySuggestions("2025_독서토론계획",[{from:"2025",to:"2026"}])).toBe("2026_독서토론계획");
  });

  it("빈 양식으로 만들 값을 종류별로 찾는다",()=>{
    const found=detectBlankTargets("2025학년도 계획 · 회의 4월 3일(수) · 담당 김민정 선생님");
    expect(found.find(t=>t.text==="4월 3일(수)")?.kind).toBe("날짜");
    expect(found.find(t=>t.text==="김민정")?.kind).toBe("이름");
  });

  it("업무 용어를 사람 이름으로 잘못 잡지 않는다",()=>{
    const found=detectBlankTargets("담당교과 교사 확인 · 성적관리 부장 결재");
    expect(found.some(t=>t.kind==="이름")).toBe(false);
  });

  it("고른 값만 비우고 항목 이름과 표는 남긴다",()=>{
    const source=build("<p>단계 학업성적관리위원회 4월 3일(수) 비고</p>");
    const result=unzipSync(blankOut(source,[{text:"4월 3일(수)"}]));
    const xml=strFromU8(result["Contents/section0.xml"]);
    expect(xml).toContain("학업성적관리위원회");
    expect(xml).not.toContain("4월 3일");
    expect([...result["BinData/image.bin"]]).toEqual([1,2,3]);
  });

  it("비울 값이 없으면 원본을 그대로 둔다",()=>{
    const source=build("<p>4월 3일(수)</p>");
    expect(blankOut(source,[])).toBe(source);
  });
});
