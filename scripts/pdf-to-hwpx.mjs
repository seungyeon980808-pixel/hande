// 주간계획표 PDF 를 편집 가능한 HWPX 로 옮긴다.
//
// PDF 는 글자와 선의 좌표만 있는 형식이라 표 구조가 남아 있지 않다.
// 여기서는 PyMuPDF 가 뽑아 준 표 사양(.pdf-spec.json — 행/열/병합/열너비/셀 텍스트)을 받아,
// rHWP 로 빈 문서에 같은 모양의 표를 다시 세우고 글을 채운다.
// 이미지·괘선 장식은 옮기지 않는다. 본문과 표만 정확히 살리는 것이 목적이다.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { initSync, HwpDocument } from "@rhwp/core";

const root = path.resolve(import.meta.dirname, "..");
initSync({ module: readFileSync(path.join(root, "node_modules/@rhwp/core/rhwp_bg.wasm")) });

function ok(json, what) {
  const result = JSON.parse(json);
  if (result.ok === false) throw new Error(`${what} 실패: ${result.error ?? json}`);
  return result;
}

const spec = JSON.parse(readFileSync(path.join(root, ".pdf-spec.json"), "utf8"));
const outPath = process.argv[2] ?? path.join(root, "시연자료/2026_6월4주_주간계획표.hwpx");

const doc = HwpDocument.createEmpty();
try {
  ok(doc.createBlankDocument(), "빈 문서 생성");

  // 표는 문단 순서대로 쌓는다. 표 하나가 문단 하나를 차지한다.
  let paraIdx = 0;
  for (const table of spec) {
    // PDF 의 열 너비(pt)를 HWP 단위(1/7200 inch)로 옮긴다. 1pt = 100 HWPUNIT.
    const colWidths = table.colw.map(width => Math.round(width * 100));
    const created = ok(doc.createTableEx(JSON.stringify({
      sectionIdx: 0, paraIdx, charOffset: 0,
      rowCount: table.rows, colCount: table.cols, colWidths,
    })), `표 생성(${table.rows}x${table.cols})`);
    // 표가 자리잡은 실제 문단·컨트롤 번호를 그대로 쓴다. 0 으로 가정하면 안 된다.
    const tablePara = created.paraIdx;
    const ctrl = created.controlIdx;

    // 병합을 먼저 끝내고 글을 넣는다. 순서가 반대면 병합에 글이 딸려 사라진다.
    // 뒤 행부터 병합해야 앞 행 병합이 뒤 좌표를 밀지 않는다.
    const merges = table.cells.filter(cell => cell.span > 1)
      .sort((a, b) => b.r - a.r || b.c - a.c);
    for (const cell of merges) {
      ok(doc.mergeTableCells(0, tablePara, ctrl, cell.r, cell.c, cell.r, cell.c + cell.span - 1),
        `셀 병합(${cell.r},${cell.c})`);
    }

    // 병합이 끝난 뒤의 실제 셀 번호를 문서에서 직접 읽는다.
    // 병합으로 칸이 사라지면 번호가 당겨지므로 행/열로 계산하면 어긋난다.
    const cellNo = new Map();
    for (const box of JSON.parse(doc.getTableCellBboxes(0, tablePara, ctrl))) {
      cellNo.set(`${box.row},${box.col}`, box.cellIdx);
    }

    for (const cell of table.cells) {
      const text = (cell.text ?? "").trim();
      if (!text) continue;
      const index = cellNo.get(`${cell.r},${cell.c}`);
      if (index === undefined) throw new Error(`셀 번호를 찾지 못했습니다: (${cell.r},${cell.c})`);
      // 셀 안 줄바꿈은 문단으로 나눠 넣는다. 한 줄씩 넣고 다음 줄 앞에서 문단을 가른다.
      const lines = text.split("\n");
      lines.forEach((line, lineIdx) => {
        if (lineIdx > 0) {
          ok(doc.splitParagraphInCell(0, tablePara, ctrl, index, lineIdx - 1, lines[lineIdx - 1].length),
            `셀 줄바꿈(${cell.r},${cell.c})`);
        }
        if (line) ok(doc.insertTextInCell(0, tablePara, ctrl, index, lineIdx, 0, line), `셀 글 입력(${cell.r},${cell.c})`);
      });
    }
    paraIdx = tablePara + 1;
  }

  const bytes = doc.exportHwpx();
  writeFileSync(outPath, Buffer.from(bytes));
  console.log(`변환 완료: ${outPath} (${bytes.length.toLocaleString()} bytes)`);
} finally {
  doc.free();
}
