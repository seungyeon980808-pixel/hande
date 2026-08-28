export function getRhwpStudioUrl(){
  const fallback=typeof window==="undefined"
    ?"http://127.0.0.1:7700/"
    :`${window.location.protocol}//${window.location.hostname}:7700/`;
  const raw=process.env.NEXT_PUBLIC_RHWP_STUDIO_URL||fallback;
  // "/rhwp/index.html" 같은 상대경로도 받는다 (같은 서버에서 정적으로 서빙하는 배포).
  const base=typeof window==="undefined"?"http://localhost":window.location.origin;
  const url=new URL(raw,base);
  // 빈 url 값은 Studio의 전역 복구창과 외부 문서 자동 로드를 막는다.
  if(!url.searchParams.has("url"))url.searchParams.set("url","");
  return url.toString();
}
