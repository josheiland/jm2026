'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { EVENTS, mapsUrl, type WeddingEvent } from '@/lib/events'

/**
 * During the weekend itself this is the only thing on the page anybody needs:
 * what is happening right now, and what is next. Silent before Sept 5 so the
 * homepage isn't cluttered for the five weeks of run-up.
 */
export default function HappeningNow() {
  const [state, setState] = useState<{
    now: WeddingEvent | null
    next: WeddingEvent | null
    minsToNext: number
  } | null>(null)

  useEffect(() => {
    const compute = () => {
      const t = Date.now()
      // Opens a day early — people fly in Friday and want to see what's next.
      const windowStart = new Date(EVENTS[0].start).getTime() - 24 * 3600_000
      const windowEnd = new Date(EVENTS[EVENTS.length - 1].end).getTime() + 3 * 3600_000
      if (t < windowStart || t > windowEnd) return setState(null)

      const now = EVENTS.find(
        (e) => t >= new Date(e.start).getTime() && t <= new Date(e.end).getTime(),
      )
      const next = EVENTS.find((e) => new Date(e.start).getTime() > t)
      setState({
        now: now ?? null,
        next: next ?? null,
        minsToNext: next ? Math.round((new Date(next.start).getTime() - t) / 60000) : 0,
      })
    }
    compute()
    const id = setInterval(compute, 30_000)
    return () => clearInterval(id)
  }, [])

  if (!state || (!state.now && !state.next)) return null

  const { now, next, minsToNext } = state
  const urgent = next?.kind === 'shuttle' && minsToNext <= 90

  return (
    <div className="content pt-6">
      <div
        className={`card p-5 md:p-6 fade-up ${
          urgent ? '!bg-wine !border-wine text-cream' : ''
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 justify-between">
          <div>
            <p className={`eyebrow ${urgent ? '!text-blush' : ''}`}>
              {now ? 'Happening now' : 'Up next'}
            </p>
            <p
              className={`display text-2xl md:text-3xl mt-1.5 ${
                urgent ? '!text-cream' : ''
              }`}
            >
              {(now ?? next)!.name}
            </p>
            <p className={`text-sm mt-1 ${urgent ? 'text-cream/75' : 'text-ink/60'}`}>
              {(now ?? next)!.time} · {(now ?? next)!.venue}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {next && !now && (
              <span
                className={`text-sm ${urgent ? 'text-blush' : 'text-wine-soft'}`}
              >
                {minsToNext < 60
                  ? `in ${minsToNext} min`
                  : `in ${Math.round(minsToNext / 60)} hr`}
              </span>
            )}
            <a
              href={mapsUrl((now ?? next)!.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm px-4 py-2 border transition-colors ${
                urgent
                  ? 'border-cream/40 text-cream hover:bg-cream hover:text-wine'
                  : 'border-wine/25 text-wine hover:bg-wine hover:text-cream'
              }`}
            >
              Directions
            </a>
          </div>
        </div>

        {now && next && (
          <p
            className={`mt-4 pt-4 border-t text-sm ${
              urgent ? 'border-cream/20 text-cream/75' : 'border-wine/10 text-ink/55'
            }`}
          >
            Next up: <Link href="/schedule" className="link-underline">{next.name}</Link> at{' '}
            {next.time}
            {next.kind === 'shuttle' && '. Do not miss this bus.'}
          </p>
        )}
      </div>
    </div>
  )
}
