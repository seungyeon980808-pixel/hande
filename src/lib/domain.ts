export type Teacher = { id:string; name:string; department:string };
export type CollectionType = "document"|"table"|"xlsx";
export type TableColumnType = "text"|"number"|"date"|"select";
export type TableColumn = { id:string; label:string; type:TableColumnType; required:boolean; options:string[] };
export type TableRow = Record<string,string>;
export type TableDefinition = { columns:TableColumn[]; initialRows:TableRow[] };
export type SubmissionVersion = { id:string; version:number; kind?:"file"|"table"; storageKey:string; displayName:string; size:number; createdAt:string; rows?:TableRow[] };
export type Draft = { id:string; deviceKeyHash:string; kind?:"file"|"table"; storageKey:string; displayName:string; size:number; updatedAt:string; rows?:TableRow[] };
export type Recipient = Teacher & { versions:SubmissionVersion[]; drafts:Draft[] };
export type Collection = { id:string; type?:CollectionType; title:string; description:string; deadline:string; shareTokenHash:string; manageTokenHash:string; templateStorageKey:string; templateName:string; templateSize:number; table?:TableDefinition; createdAt:string; recipients:Recipient[] };
export type AppState = { collections:Collection[] };
export function collectionType(collection:Pick<Collection,"type">):CollectionType{return collection.type??"document"}
export function collectionClosed(collection:Pick<Collection,"deadline">,now=Date.now()){return new Date(collection.deadline).getTime()<=now}
export class CollectionClosedError extends Error{constructor(){super("제출 마감 시간이 지났습니다. 담당자에게 문의하세요.");this.name="CollectionClosedError"}}
export function assertCollectionOpen(collection:Pick<Collection,"deadline">,now=Date.now()){if(collectionClosed(collection,now))throw new CollectionClosedError()}
export const collectionTypeLabel=(type:CollectionType)=>type==="document"?"한글 문서":type==="table"?"웹 표":"엑셀 파일";
export const teachers:Teacher[] = [
  ["t01","김민정","교무기획부"],["t02","박성호","교육연구부"],["t03","이수진","학생생활부"],["t04","최영철","정보과학부"],
  ["t05","정하늘","진로상담부"],["t06","한지우","교무기획부"],["t07","윤서준","교육연구부"],["t08","송은경","학생생활부"],
  ["t09","강도윤","정보과학부"],["t10","오미영","진로상담부"],["t11","임재현","교무기획부"],["t12","조수아","교육연구부"],
].map(([id,name,department])=>({id,name,department}));
