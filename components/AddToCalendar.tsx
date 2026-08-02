'use client'

import { useEffect, useRef, useState } from 'react'
import { googleCalUrl } from '@/lib/ics'
import type { WeddingEvent } from '@/lib/events'

/**
 * The closest thing to an automated reminder that actually reaches a guest's phone:
 * a calendar entry with the alarm already on it.
 *
 * Two named options, because everyone knows which of the two they use. Outlook is
 * deliberately absent: its web link cannot open the Outlook app from a phone, and the
 * .ics behind "Apple Calendar" is picked up by Outlook anyway wherever it is the
 * registered handler. A third entry that misbehaves on mobile is worse than none.
 */

const GoogleMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.5h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.3z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.2-1.9-6-4.4H2.3v2.9A10.9 10.9 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M6 14.3a6.5 6.5 0 0 1 0-4.2V7.2H2.3a10.9 10.9 0 0 0 0 9.8L6 14.3z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A10.9 10.9 0 0 0 2.3 7.2L6 10.1c.8-2.5 3.2-4.7 6-4.7z" />
  </svg>
)

const AppleMark = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.05 8.51c-.02-1.62 1.32-2.4 1.38-2.44-.75-1.1-1.92-1.25-2.34-1.27-1-.1-1.94.58-2.45.58-.5 0-1.28-.57-2.11-.55-1.08.02-2.08.63-2.64 1.6-1.12 1.96-.29 4.86.81 6.45.54.78 1.18 1.65 2.02 1.62.81-.03 1.12-.52 2.1-.52.98 0 1.26.52 2.11.51.87-.02 1.42-.79 1.95-1.58.61-.9.87-1.78.88-1.82-.02-.01-1.69-.65-1.71-2.58zM9.5 3.76c.45-.54.75-1.3.67-2.05-.64.03-1.42.43-1.88.97-.41.48-.77 1.25-.68 1.98.71.06 1.44-.36 1.89-.9z" />
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
  // Resolved after mount so the server and first client render agree.
  const [touch, setTouch] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

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

  // Inline on touch so iOS opens the calendar sheet instead of saving to Files.
  const ics = `/api/ics?e=${event.slug}${touch ? '&inline=1' : ''}`

  const options = [
    { label: 'Apple Calendar', href: ics, icon: <AppleMark />, external: false },
    { label: 'Google Calendar', href: googleCalUrl(event), icon: <GoogleMark />, external: true },
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
                  : touch
                    ? {}
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
        <p className="mt-2 text-sm text-ink/50">
          {touch
            ? `Opens in your calendar app, with a reminder ${lead} beforehand`
            : `The download sets a reminder ${lead} beforehand`}
        </p>
      )}
    </div>
  )
}
