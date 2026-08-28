import ExcelJS from "exceljs";
import type { Collection,TableColumn,TableRow } from "./domain";

function styleHeader(row:ExcelJS.Row){
  row.font={bold:true,color:{argb:"FFFFFFFF"}};
  row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF174A7E"}};
  row.alignment={vertical:"middle",horizontal:"center"};
}

const DATE_NUMBER_FORMAT='yyyy"년" m"월" d"일" hh:mm';

function cellValue(column:TableColumn,row:TableRow):string|number{
  const value=row[column.id]??"";
  if(column.type==="number"&&value!==""&&Number.isFinite(Number(value)))return Number(value);
  return value;
}

export async function createTableWorkbook(collection:Collection):Promise<Buffer>{
  if(!collection.table)throw new Error("표 양식을 찾을 수 없습니다.");
  const workbook=new ExcelJS.Workbook();
  workbook.creator="학교업무 한곳";
  workbook.created=new Date();
  const result=workbook.addWorksheet("전체 취합 결과",{views:[{state:"frozen",ySplit:1}]});
  const base=["교사명","부서","제출시각"];
  result.addRow([...base,...collection.table.columns.map(column=>column.label)]);
  styleHeader(result.getRow(1));
  for(const recipient of collection.recipients){
    const latest=[...recipient.versions].reverse().find(version=>version.kind==="table");
    if(!latest?.rows)continue;
    for(const row of latest.rows){
      const output=result.addRow([recipient.name,recipient.department,new Date(latest.createdAt),...collection.table.columns.map(column=>cellValue(column,row))]);
      output.getCell(3).numFmt=DATE_NUMBER_FORMAT;
    }
  }
  result.columns.forEach((column,index)=>{column.width=index<3?18:Math.max(12,Math.min(35,(collection.table?.columns[index-3]?.label.length??8)+8))});
  result.autoFilter={from:"A1",to:{row:1,column:base.length+collection.table.columns.length}};

  const status=workbook.addWorksheet("제출 현황",{views:[{state:"frozen",ySplit:1}]});
  status.addRow(["교사명","부서","상태","제출 버전","최근 활동"]);
  styleHeader(status.getRow(1));
  for(const recipient of collection.recipients){
    const latest=recipient.versions.at(-1),draft=recipient.drafts.at(-1);
    const state=draft&&latest?"수정 중":draft?"작성 중":latest?"제출 완료":"미작성";
    const activity=draft?.updatedAt??latest?.createdAt??"";
    const output=status.addRow([recipient.name,recipient.department,state,recipient.versions.length,activity?new Date(activity):""]);
    if(activity)output.getCell(5).numFmt=DATE_NUMBER_FORMAT;
  }
  status.columns=[{width:14},{width:18},{width:14},{width:12},{width:24}];
  status.autoFilter={from:"A1",to:"E1"};
  const bytes=await workbook.xlsx.writeBuffer();
  return Buffer.from(bytes);
}
