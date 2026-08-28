import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { HwpDocument,initSync } from "@rhwp/core";
import type { SharedFieldDefinition,SharedFieldState } from "./domain";

type RhwpField={fieldId:number;name:string;guide?:string;value?:string;fieldType?:string};
let initialized=false;

function initializeRhwp(){
  if(initialized)return;
  initSync({module:readFileSync(path.join(process.cwd(),"node_modules","@rhwp","core","rhwp_bg.wasm"))});
  initialized=true;
}

function parseResult(value:string){const result=JSON.parse(value) as {ok?:boolean;[key:string]:unknown};if(result.ok===false)throw new Error(typeof result.error==="string"?result.error:"rHWP 필드 처리에 실패했습니다.");return result}

export function extractNamedFields(bytes:Uint8Array){
  initializeRhwp();
  const document=new HwpDocument(bytes);
  try{
    const fields=JSON.parse(document.getFieldList()) as RhwpField[];
    const named=fields.filter(field=>field.name?.trim()).map(field=>({sourceName:field.name.trim(),label:field.guide?.trim()||field.name.trim(),initialValue:field.value??"",fieldType:field.fieldType??"field"}));
    const duplicates=named.filter((field,index)=>named.findIndex(candidate=>candidate.sourceName===field.sourceName)!==index).map(field=>field.sourceName);
    if(duplicates.length)throw new Error(`같은 이름의 필드가 중복되어 있습니다: ${[...new Set(duplicates)].join(", ")}`);
    return named;
  }finally{document.free()}
}

type MarkerMatch={sec:number;para:number;charOffset:number;length:number;cellContext?:{parentPara:number;ctrlIdx:number;cellIdx:number;cellPara:number}};

export function materializeSharedFieldMarkers(bytes:Uint8Array,marker="[[입력]]"){
  initializeRhwp();
  const document=new HwpDocument(bytes);
  try{
    const existing=new Set((JSON.parse(document.getFieldList()) as RhwpField[]).map(field=>field.name));
    const sourceMatches=JSON.parse(document.searchAllText(marker,true,true)) as MarkerMatch[];
    let serial=1;
    const assigned=sourceMatches.map(match=>{
      while(existing.has(`manual_field_${serial}`))serial++;
      const item={match,name:`manual_field_${serial}`,guide:`작성 영역 ${serial}`};
      existing.add(item.name);serial++;
      return item;
    }).sort((a,b)=>b.match.sec-a.match.sec||b.match.para-a.match.para||(b.match.cellContext?.cellIdx??-1)-(a.match.cellContext?.cellIdx??-1)||b.match.charOffset-a.match.charOffset);
    for(const {match,name,guide} of assigned){
      if(match.cellContext){
        const cell=match.cellContext;
        parseResult(document.deleteTextInCell(match.sec,cell.parentPara,cell.ctrlIdx,cell.cellIdx,cell.cellPara,match.charOffset,match.length));
        parseResult(document.insertClickHereFieldInCell(match.sec,cell.parentPara,cell.ctrlIdx,cell.cellIdx,cell.cellPara,match.charOffset,false,guide,"",name,true));
      }else{
        parseResult(document.deleteText(match.sec,match.para,match.charOffset,match.length));
        parseResult(document.insertClickHereField(match.sec,match.para,match.charOffset,guide,"",name,true));
      }
    }
    return {bytes:document.exportHwpx(),converted:sourceMatches.length};
  }finally{document.free()}
}

export function applySharedFieldValues(bytes:Uint8Array,fields:SharedFieldDefinition[],states:SharedFieldState[],includeShared:boolean){
  initializeRhwp();
  const document=new HwpDocument(bytes);
  try{
    for(const field of [...fields].sort((a,b)=>a.order-b.order)){
      const state=states.find(candidate=>candidate.fieldId===field.id);
      const visible=[...(state?.versions??[])].reverse().find(version=>version.status==="submitted"||(includeShared&&version.status==="shared"));
      const value=visible?.value??(field.initialContentMode==="template"?field.initialValue:"");
      parseResult(document.setFieldValueByName(field.sourceName,value));
    }
    return document.exportHwpx();
  }finally{document.free()}
}

export function latestVisibleFieldValue(field:SharedFieldDefinition,state:SharedFieldState|undefined,includeShared=true){
  const visible=[...(state?.versions??[])].reverse().find(version=>version.status==="submitted"||(includeShared&&version.status==="shared"));
  return visible?.value??(field.initialContentMode==="template"?field.initialValue:"");
}
