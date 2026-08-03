/*
 * Offline support, for one specific moment: a guest standing in a field in Afton with
 * one bar of signal, trying to find out when the bus leaves. That is when the site
 * matters most and is least likely to load.
 *
 * Strategy:
 *   Pages   network first, falling back to cache. Online guests always get fresh
 *           content; offline guests get the last copy they saw.
 *   Assets  cache first, because Next fingerprints the filenames, so a cached hit is
 *           always correct for that exact URL.
 *   /api/   never cached. Uploads and the health check must always hit the network,
 *           and a stale upload session would be worse than no answer.
 */

const VERSION = 'mj-2026-09-v1'
const PAGES = ['/', '/schedule', '/faq', '/guests', '/charlottesville', '/photos']

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION)
      // Individually, so one failure does not abandon the whole precache.
      await Promise.all(
        PAGES.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => (res.ok ? cache.put(url, res) : null))
            .catch(() => null),
        ),
      )
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  const isPage = request.mode === 'navigate'

  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION)

      if (isPage) {
        try {
          const fresh = await fetch(request)
          if (fresh.ok) cache.put(request, fresh.clone())
          return fresh
        } catch {
          return (
            (await cache.match(request)) ??
            (await cache.match('/schedule')) ??
            (await cache.match('/')) ??
            new Response(
              '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
                '<body style="font-family:Georgia,serif;background:#f5efe8;color:#43302f;display:grid;place-items:center;height:100vh;margin:0;text-align:center">' +
                '<div><p style="font-size:1.5rem;margin:0 0 .5rem">No signal</p>' +
                '<p style="opacity:.7">The bus leaves Stacey Hall at 4:15pm.</p></div>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 },
            )
          )
        }
      }

      const hit = await cache.match(request)
      if (hit) return hit
      try {
        const fresh = await fetch(request)
        if (fresh.ok) cache.put(request, fresh.clone())
        return fresh
      } catch {
        return new Response('', { status: 504 })
      }
    })(),
  )
})
