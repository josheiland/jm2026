'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RidgeEdge } from './Ridgeline'
import { EVENTS, mapsUrl, type WeddingEvent } from '@/lib/events'

/**
 * During the weekend itself this is the only thing on the page anybody needs:
 * what is happening right now, and what is next. Silent before Sept 5 so the
 * homepage isn't cluttered for the five weeks of run-up.
 *
 * A full-bleed dark band with the ridge as its top edge, rather than a card. The
 * band and its mountains are one object — this is the only ridgeline on the page,
 * and the arrow on the right is what stops it reading as a banner.
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
  const event = (now ?? next)!
  const urgent = next?.kind === 'shuttle' && minsToNext <= 90

  // On a wine band the old urgent treatment — swap cream for wine — has nowhere
  // to go, so it inverts instead: cream ground, wine text, cream mountains.
  const ground = urgent ? 'bg-cream' : 'bg-wine-deep'
  const ridgeFill = urgent ? '#f5efe8' : '#43302f'
  const label = urgent ? '!text-wine-soft' : '!text-blush'
  const heading = urgent ? '!text-wine-deep' : '!text-cream'
  const secondary = urgent ? 'text-wine' : 'text-blush/85'

  const inner = (
    <>
      <RidgeEdge fill={ridgeFill} className="-top-[42px] h-[44px] md:-top-[64px] md:h-[66px]" />

      <div className="content relative flex items-center gap-4">
        <div className="flex-1">
          <p className={`eyebrow ${label}`}>
            {now ? 'Happening now' : 'Up next'}
          </p>
          <p className={`display ${heading} mt-1.5 text-[27px] md:text-3xl`}>
            {event.name}
            <span className={`ml-2.5 text-[0.7em] ${secondary}`}>
              {now
                ? event.time
                : minsToNext < 60
                  ? `in ${minsToNext} min`
                  : `in ${Math.round(minsToNext / 60)} hr`}
            </span>
          </p>
          {now && next && (
            <p className={`mt-1.5 text-sm ${secondary}`}>
              Next up: {next.name} at {next.time}
              {next.kind === 'shuttle' && '. Do not miss this bus.'}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 text-[22px] leading-none ${urgent ? 'text-wine-soft' : 'text-blush'}`}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </>
  )

  const cls = `relative block ${ground} py-5 pb-[18px] fade-up`

  // Mid-event the useful link is the map; otherwise it's the schedule, because
  // "what's next" is a question about the rest of the day, not one address.
  return now ? (
    <a
      href={mapsUrl(event.mapQuery)}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      aria-label={`Happening now: ${event.name}. Directions.`}
    >
      {inner}
    </a>
  ) : (
    <Link href="/schedule" className={cls} aria-label={`Up next: ${event.name}. See the schedule.`}>
      {inner}
    </Link>
  )
}
