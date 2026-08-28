import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { tokenHash } from "@/lib/security";

const COOKIE_PREFIX="hande_manage_";
const COOKIE_MAX_AGE=60*60*24*365;
const collectionIdPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function manageAccessCookieName(id:string){
  return collectionIdPattern.test(id)?`${COOKIE_PREFIX}${id}`:undefined;
}

export function setManageAccessCookie(response:NextResponse,id:string,token:string){
  const name=manageAccessCookieName(id);
  if(!name)throw new Error("Invalid collection ID.");
  response.cookies.set({name,value:token,httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:COOKIE_MAX_AGE});
}

export async function getManageAccessToken(id:string){
  const name=manageAccessCookieName(id);
  return name?(await cookies()).get(name)?.value:undefined;
}

export async function hasManageAccess(id:string,manageTokenHash:string){
  const token=await getManageAccessToken(id);
  return Boolean(token&&tokenHash(token)===manageTokenHash);
}
