const C='wp-v1',A=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method==='POST'&&u.pathname.endsWith('share-target')){
    e.respondWith((async()=>{
      const f=(await r.formData()).getAll('media');
      const c=await caches.open('shared');
      await Promise.all(f.map((x,i)=>c.put(new URL('shared/'+i,self.registration.scope),new Response(x,{headers:{'Content-Type':x.type}}))));
      return Response.redirect('./index.html?shared='+f.length,303);
    })());
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
