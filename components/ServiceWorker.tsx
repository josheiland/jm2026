'use client'

import { useEffect } from 'react'

/**
 * Registers the offline cache after the page has settled, so it never competes with
 * the first render for bandwidth. Once a guest has opened the site anywhere with
 * signal, the schedule stays available at the venue without it.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is a bonus; never surface a failure to a guest */
      })
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])

  return null
}
