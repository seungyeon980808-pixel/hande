export function getRhwpStudioUrl(){
  const fallback=typeof window==="undefined"
    ?"http://127.0.0.1:7700/"
    :`${window.location.protocol}//${window.location.hostname}:7700/`;
  const url=new URL(process.env.NEXT_PUBLIC_RHWP_STUDIO_URL||fallback);
  // 빈 url 값은 Studio의 전역 복구창과 외부 문서 자동 로드를 막는다.
  if(!url.searchParams.has("url"))url.searchParams.set("url","");
  return url.toString();
}
