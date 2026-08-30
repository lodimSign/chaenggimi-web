// 챙기미 PWA 서비스워커. 사양: docs/first-run-spec.md 0-2절.
//
// **network-first + 캐시 폴백**이다. cache-first 로 하면 배포한 새 화면 대신 옛 화면이
// 박혀서 "고쳤는데 안 바뀐다"가 된다. 여기서는 늘 서버를 먼저 보고, 못 갈 때만 캐시를 준다
// — 그래서 비행기모드에서도 앱이 열린다 (Expo Go 로는 원래 못 하던 것).
const CACHE = 'chaenggimi-shell-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 옛 버전 캐시는 지운다 — 이름이 바뀌면 통째로 새로 받는다.
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // GET 이 아닌 것과 다른 도메인(엣지 함수·트리플)은 손대지 않는다.
  // 서버 응답을 캐시했다가 씌우면 안 올라간 체크가 조용히 사라진다 (invite-spec F-5 와 같은 사고).
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.status === 200) {
        const copy = fresh.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
      }
      return fresh;
    } catch (error) {
      const hit = await caches.match(request);
      if (hit) return hit;
      // 주소를 직접 열었는데 그 문서가 캐시에 없으면 시작 화면이라도 준다.
      if (request.mode === 'navigate') {
        const shell = await caches.match(new URL('./', self.location).toString());
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
