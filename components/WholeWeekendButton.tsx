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
      <p className="mt-2.5 text-xs text-ink/45">
        {touch
          ? 'Every event with its reminders, straight into your calendar app. Works with Apple Calendar, Outlook and Google.'
          : 'One file, every event, reminders already set. Opens in Apple Calendar, Outlook or Google. Individual events have one-tap links below.'}
      </p>
    </>
  )
}
