'use client'

import { useEffect, useState } from 'react'
import { WEDDING_DATE } from '@/lib/events'

const TARGET = new Date(WEDDING_DATE).getTime()

function parts(ms: number) {
  const clamp = Math.max(0, ms)
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor(clamp / 3600000) % 24,
    minutes: Math.floor(clamp / 60000) % 60,
    seconds: Math.floor(clamp / 1000) % 60,
  }
}

export default function Countdown() {
  // Rendered null on the server: the value depends on the visitor's clock, and
  // guessing it server-side guarantees a hydration mismatch.
  const [left, setLeft] = useState<ReturnType<typeof parts> | null>(null)

  useEffect(() => {
    const tick = () => setLeft(parts(TARGET - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const past = left !== null && TARGET - Date.now() <= 0

  if (past) {
    return (
      <p className="display text-2xl md:text-3xl text-wine">
        Married.
      </p>
    )
  }

  // Short labels on phones. "minutes" and "seconds" at 0.24em tracking are what made
  // the row overflow, not the numerals.
  const units: [string, string, number | null][] = [
    ['days', 'days', left?.days ?? null],
    ['hours', 'hrs', left?.hours ?? null],
    ['minutes', 'min', left?.minutes ?? null],
    ['seconds', 'sec', left?.seconds ?? null],
  ]

  return (
    <>
      <div
        className="grid grid-cols-4 max-w-xs sm:max-w-md mx-auto"
        role="timer"
        aria-label="Countdown to the wedding"
      >
        {units.map(([long, short, value], i) => (
          <div
            key={long}
            className={`text-center px-1 sm:px-2 ${
              i > 0 ? 'border-l border-wine/12' : ''
            }`}
          >
            <div className="display text-3xl sm:text-4xl md:text-5xl tabular-nums text-wine-deep">
              {value === null ? (
                <span className="inline-block w-[1.6ch] h-[0.8em] bg-wine/8 rounded-sm align-middle" />
              ) : (
                String(value).padStart(2, '0')
              )}
            </div>
            <div className="eyebrow mt-2 !text-[0.75rem] !tracking-[0.08em] !indent-[0.08em] sm:!text-xs sm:!tracking-[0.2em] sm:!indent-[0.2em]">
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{long}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-ink/60">not that anyone’s counting</p>
    </>
  )
}
