const URLS_TO_CACHE = ["/"];
const CACHE_NAME = "playontable-cache";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        }).then(() => {
            self.skipWaiting();
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            self.clients.claim();
        })
    );
});

self.addEventListener("fetch", event => {
    const req = event.request;

    if (req.method !== "GET") return;

    if (req.cache === "only-if-cached" && req.mode !== "same-origin") {
        event.respondWith(fetch(req));
        return;
    }

    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;

            const url = new URL(req.url);

            if (url.origin !== self.location.origin) {
                return fetch(req).catch(() => {
                    return caches.match(req).then(c => {
                        return c || new Response("Offline", {
                            status: 503,
                            headers: { "Content-Type": "text/plain" }
                        });
                    });
                });
            }

            return fetch(req).then(networkResp => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(req, networkResp.clone());
                    return networkResp;
                });
            }).catch(() => {
                if (req.mode === "navigate") {
                    return caches.match("/").then(fallback => {
                        return fallback || new Response("Offline", {
                            status: 503,
                            headers: { "Content-Type": "text/plain" }
                        });
                    });
                }
                return new Response("Offline", {
                    status: 503,
                    headers: { "Content-Type": "text/plain" }
                });
            });
        })
    );
});