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

  const units: [string, number | null][] = [
    ['days', left?.days ?? null],
    ['hours', left?.hours ?? null],
    ['minutes', left?.minutes ?? null],
    ['seconds', left?.seconds ?? null],
  ]

  return (
    <div
      className="flex items-start justify-center gap-6 sm:gap-10"
      role="timer"
      aria-label="Countdown to the wedding"
    >
      {units.map(([label, value], i) => (
        <div key={label} className="flex items-start gap-6 sm:gap-10">
          <div className="text-center min-w-[3ch]">
            <div className="display text-4xl sm:text-5xl md:text-6xl tabular-nums text-wine-deep">
              {value === null ? (
                <span className="inline-block w-[2ch] h-[1em] bg-wine/8 rounded-sm align-middle" />
              ) : (
                String(value).padStart(2, '0')
              )}
            </div>
            <div className="eyebrow mt-2">{label}</div>
          </div>
          {i < units.length - 1 && (
            <span className="display text-3xl sm:text-4xl text-wine/20 pt-1" aria-hidden="true">
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
