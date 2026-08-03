'use client'

import { useEffect, useState } from 'react'

const CalMark = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M1.5 6.5h13M5 1.5V4M11 1.5V4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Every event in one file, styled to match the per-event buttons further down the page
 * so the two read as one control at different scopes.
 *
 * Served inline on touch, because Content-Disposition attachment makes iOS Safari save
 * to Files and leave the guest to go find it. Unlike the per-event buttons there is no
 * Google option here: a Google Calendar link carries one event, not seven.
 */
export default function WholeWeekendButton() {
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  return (
    <a
      href={touch ? '/api/ics?inline=1' : '/api/ics'}
      {...(touch ? {} : { download: true })}
      className="inline-flex items-center gap-2 border border-wine/25 text-wine px-4 py-2.5 text-sm hover:bg-wine hover:text-cream transition-colors"
    >
      <CalMark />
      Add all events to calendar
    </a>
  )
}
