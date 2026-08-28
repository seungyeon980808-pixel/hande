// 예전 편집기의 서비스워커를 밀어내는 자폭용 워커.
// 설치되자마자 모든 캐시를 지우고 스스로 해제해, 새 편집기가 바로 뜨게 한다.
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys())await caches.delete(key);
    await self.registration.unregister();
    for(const client of await self.clients.matchAll({type:"window"}))client.navigate(client.url);
  })());
});
