'use client'

import { useEffect, useState } from 'react'

/**
 * The whole weekend as one calendar file. Same iOS handling as AddToCalendar: served
 * inline on touch devices so Safari opens the calendar sheet rather than saving the
 * file to Files and leaving the guest to find it.
 */
export default function WholeWeekendButton() {
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  return (
    <>
      <a
        href={touch ? '/api/ics?inline=1' : '/api/ics'}
        {...(touch ? {} : { download: true })}
        className="inline-flex items-center gap-2 border border-wine/25 text-wine px-6 py-3 text-sm uppercase tracking-[0.14em] hover:bg-wine hover:text-cream transition-colors"
      >
        Add the whole weekend
      </a>
      <p className="mt-2.5 text-sm text-ink/50">
        {touch
          ? 'Every event with its reminders, straight into your calendar app'
          : 'One file, every event, reminders already set. Individual events have Apple and Google links below.'}
      </p>
    </>
  )
}
