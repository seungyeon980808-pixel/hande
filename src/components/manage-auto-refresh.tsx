"use client";

import { useCallback,useEffect,useState,useTransition } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS=10_000;

export function ManageAutoRefresh(){
  const router=useRouter();
  const [pending,startTransition]=useTransition();
  const [lastUpdated,setLastUpdated]=useState(()=>new Date());

  const refresh=useCallback(()=>{
    startTransition(()=>{
      router.refresh();
      setLastUpdated(new Date());
    });
  },[router]);

  useEffect(()=>{
    const interval=window.setInterval(refresh,REFRESH_INTERVAL_MS);
    const onVisibilityChange=()=>{if(document.visibilityState==="visible")refresh()};
    document.addEventListener("visibilitychange",onVisibilityChange);
    return()=>{
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange",onVisibilityChange);
    };
  },[refresh]);

  return <div className="refresh-control">
    <span className="help" aria-live="polite">마지막 갱신 {lastUpdated.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
    <button type="button" className="btn btn-secondary" disabled={pending} onClick={refresh}>{pending?"갱신 중...":"현황 새로고침"}</button>
  </div>;
}
