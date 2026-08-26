import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
const root=path.join(process.cwd(),"storage","private"); export const MAX_FILE_BYTES=20*1024*1024;
export function validateDocument(file:File){const ext=path.extname(file.name).toLowerCase();if(!new Set([".hwp",".hwpx"]).has(ext))throw new Error("HWP 또는 HWPX 파일만 올릴 수 있습니다.");if(file.size<=0||file.size>MAX_FILE_BYTES)throw new Error("파일 크기는 20MB 이하여야 합니다.");return ext}
export async function storeFile(file:File){const ext=validateDocument(file);await fs.mkdir(root,{recursive:true,mode:0o700});const key=`${randomUUID()}${ext}`;await fs.writeFile(path.join(root,key),Buffer.from(await file.arrayBuffer()),{mode:0o600});return {key,size:file.size}}
export async function storeSpreadsheet(file:File){
  const ext=path.extname(file.name).toLowerCase();
  if(ext!==".xlsx")throw new Error("XLSX 파일만 올릴 수 있습니다.");
  if(file.size<=0||file.size>MAX_FILE_BYTES)throw new Error("파일 크기는 20MB 이하여야 합니다.");
  const allowed=new Set(["","application/octet-stream","application/zip","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
  if(!allowed.has(file.type.toLowerCase()))throw new Error("XLSX 파일 형식이 올바르지 않습니다.");
  const bytes=Buffer.from(await file.arrayBuffer());
  if(bytes.length<4||bytes[0]!==0x50||bytes[1]!==0x4b)throw new Error("손상되었거나 올바르지 않은 XLSX 파일입니다.");
  await fs.mkdir(root,{recursive:true,mode:0o700});
  const key=`${randomUUID()}${ext}`;
  await fs.writeFile(path.join(root,key),bytes,{mode:0o600});
  return {key,size:file.size};
}
export async function readStored(key:string){if(!/^[a-f0-9-]+\.(hwp|hwpx|xlsx)$/i.test(key))throw new Error("잘못된 파일 경로입니다.");return fs.readFile(path.join(root,key))}
export async function deleteStored(key:string){if(!/^[a-f0-9-]+\.(hwp|hwpx|xlsx)$/i.test(key))return;try{await fs.unlink(path.join(root,key))}catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")throw error}}
