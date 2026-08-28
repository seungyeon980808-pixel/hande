import { NextResponse } from "next/server";
import { z } from "zod";
import { setManageAccessCookie } from "@/lib/manage-access";
import { findManaged } from "@/lib/repository";
import { tokenHash } from "@/lib/security";

const schema=z.object({id:z.string().uuid(),token:z.string().min(1).max(256)});

export async function POST(request:Request){
  let body:unknown;
  try{body=await request.json()}catch{return Response.json({error:"Invalid request."},{status:400})}
  const parsed=schema.safeParse(body);
  if(!parsed.success)return Response.json({error:"Invalid request."},{status:400});
  const {id,token}=parsed.data;
  if(!(await findManaged(id,tokenHash(token))))return Response.json({error:"Not found."},{status:404});
  const response=new NextResponse(null,{status:204});
  setManageAccessCookie(response,id,token);
  return response;
}
