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

  // One line, not four cells. The countdown is the last thing in the cream and
  // has to sit under the names without competing with them for size.
  const units: [string, string, number | null][] = [
    ['days', 'days', left?.days ?? null],
    ['hours', 'hrs', left?.hours ?? null],
    ['minutes', 'min', left?.minutes ?? null],
  ]

  return (
    <p
      className="font-ui text-[12px] font-medium uppercase tracking-[0.18em] text-wine tabular-nums"
      role="timer"
      aria-label="Countdown to the wedding"
    >
      {left === null ? (
        <span className="inline-block h-[0.8em] w-[14ch] rounded-sm bg-wine/8 align-middle" />
      ) : (
        units.map(([long, short, value], i) => (
          <span key={long}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            {value} <span className="sr-only">{long}</span>
            <span aria-hidden="true">{short}</span>
          </span>
        ))
      )}
    </p>
  )
}
