import { createHash,randomBytes } from "node:crypto";
export const newToken=()=>randomBytes(32).toString("base64url");
export const tokenHash=(token:string)=>createHash("sha256").update(token).digest("hex");
export const safeFileName=(value:string)=>value.replace(/[\\/:*?"<>|\u0000-\u001f]/g,"_").replace(/\.\.+/g,".").replace(/^[._]+/,"").slice(0,120);
