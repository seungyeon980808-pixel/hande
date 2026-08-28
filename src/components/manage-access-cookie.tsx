"use client";

import { useEffect } from "react";

export function ManageAccessCookie({id,token}:{id:string;token:string}){
  useEffect(()=>{
    void fetch("/api/manage/access",{
      method:"POST",
      credentials:"same-origin",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id,token}),
    });
  },[id,token]);
  return null;
}
