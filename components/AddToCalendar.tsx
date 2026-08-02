'use client'

import { useEffect, useRef, useState } from 'react'
import { googleCalUrl, outlookCalUrl } from '@/lib/ics'
import type { WeddingEvent } from '@/lib/events'

/**
 * The closest thing to an automated reminder that actually reaches a guest's phone:
 * a calendar entry with the alarm already on it.
 *
 * Google and Outlook get named buttons rather than hiding behind a generic "add to
 * calendar", because most people know which of those they use and would not think to
 * look inside a menu. Apple and everything else takes the .ics, which also carries
 * the VALARM that Google and Outlook links cannot.
 */

const GoogleMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.5h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.3z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.2-1.9-6-4.4H2.3v2.9A10.9 10.9 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M6 14.3a6.5 6.5 0 0 1 0-4.2V7.2H2.3a10.9 10.9 0 0 0 0 9.8L6 14.3z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A10.9 10.9 0 0 0 2.3 7.2L6 10.1c.8-2.5 3.2-4.7 6-4.7z" />
  </svg>
)

const OutlookMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#0364B8" d="M23 6.5v11a1 1 0 0 1-1 1h-9v-13h9a1 1 0 0 1 1 1z" />
    <path fill="#0F78D4" d="M13 8.5h10v4H13z" opacity=".6" />
    <path fill="#28A8EA" d="M13 12.5h10v4H13z" opacity=".5" />
    <path fill="#14447D" d="M1 4.2 12 2.2v19.6L1 19.8z" />
    <ellipse cx="6.5" cy="12" rx="2.6" ry="3.2" fill="#fff" />
  </svg>
)

const CalMark = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 6.5h13M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

export default function AddToCalendar({
  event,
  compact = false,
}: {
  event: WeddingEvent
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const lead = event.kind === 'ceremony' ? '2 hours' : '1 hour'

  const options = [
    { label: 'Google Calendar', href: googleCalUrl(event), icon: <GoogleMark />, external: true },
    { label: 'Outlook', href: outlookCalUrl(event, 'live'), icon: <OutlookMark />, external: true },
    { label: 'Outlook (work)', href: outlookCalUrl(event, 'office'), icon: <OutlookMark />, external: true },
    { label: 'Apple or download', href: `/api/ics?e=${event.slug}`, icon: <CalMark />, external: false },
  ]

  return (
    <div className={compact ? '' : 'mt-5'} ref={wrap}>
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="inline-flex items-center gap-2 border border-wine/25 text-wine px-4 py-2.5 text-sm hover:bg-wine hover:text-cream transition-colors"
        >
          <CalMark />
          Add to calendar
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
              <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute left-0 top-full mt-1 z-30 min-w-[15rem] bg-cream-soft border border-wine/20 shadow-lift-lg"
          >
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                role="menuitem"
                {...(o.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : { download: true })}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blush/30 transition-colors border-b border-wine/8 last:border-0"
              >
                {o.icon}
                {o.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {!compact && (
        <p className="mt-2 text-xs text-ink/40">
          The download sets a reminder {lead} beforehand
        </p>
      )}
    </div>
  )
}
