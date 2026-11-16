const C='recetitas-v1',SHELL=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;if(!(u.origin===location.origin||/jsdelivr\.net|fonts\.g(oogleapis|static)\.com/.test(u.host)))return;
e.respondWith(fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const cl=x.clone();caches.open(C).then(c=>c.put(r,cl))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))});
