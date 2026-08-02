'use client'

import { useState } from 'react'
import Countdown from '@/components/Countdown'
import { DAYS, eventsForDay } from '@/lib/events'

/**
 * Headings are Cormorant Garamond at light weight. This compares body faces beneath
 * that: five candidates side by side with identical copy, then full-page.
 */

const BODIES = [
  {
    id: 'body-cormorant',
    name: 'Cormorant',
    tag: 'Live now',
    why: 'Matches the heading, one weight down. The most traditionally bridal of the five, and set a size larger than the sans options because it runs small.',
  },
  {
    id: 'body-jost',
    name: 'Jost',
    tag: 'Closest to Zola',
    why: 'Geometric sans in the Futura line, which is what Circular is. The truest match to your Zola page. Slightly cool and architectural.',
  },
  {
    id: 'body-dmsans',
    name: 'DM Sans',
    tag: 'Best on screen',
    why: 'Same geometric family, drawn for screens. Rounder, warmer, a larger x-height. Easier to read at length than Jost without losing the modern feel.',
  },
  {
    id: 'body-lato',
    name: 'Lato',
    tag: 'Easiest read',
    why: 'Humanist rather than geometric, so the letterforms are more open. The kindest of the five to anyone reading on a phone without their glasses.',
  },
  {
    id: 'body-ebgaramond',
    name: 'EB Garamond',
    tag: 'Warmest',
    why: 'A serif body under a sans heading, which is the classic inversion. Bookish and warm, and it makes the jokes land softer. The biggest personality shift.',
  },
]

const SAMPLE =
  'Buses load in front of The Draftsman and all of them leave at 4:15pm. Coming home there are two, at 9:30pm and 11:00pm.'

export default function StylesPage() {
  const [active, setActive] = useState(BODIES[0])

  return (
    <>
      <header className="content pt-14 pb-8">
        <p className="eyebrow">Type</p>
        <h1 className="display text-4xl md:text-6xl mt-4">Pick a body font</h1>
        <div className="mt-6 card p-6 max-w-3xl">
          <p className="text-ink/75">
            Headings and body are both <strong>Cormorant Garamond</strong>, separated by
            weight: light at display size, regular in a paragraph. Small labels, buttons and nav
            stay in <strong>Jost</strong>, because Cormorant at 11px with wide tracking is
            prettier than it is readable.
          </p>
          <p className="mt-3 text-ink/65 text-[0.95rem]">
            Sauvage is not on Adobe Fonts, so matching the Zola headings exactly is off the
            table. Below are the body options against the Cormorant heading.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------- side by side */}
      <section className="content pb-16">
        <p className="eyebrow">All five at once</p>
        <div className="rule mt-4 mb-8" />

        <div className="grid gap-px bg-wine/10 md:grid-cols-2 xl:grid-cols-3">
          {BODIES.map((b) => (
            <div key={b.id} className={`${b.id} bg-cream p-7`}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="display text-2xl">{b.name}</h2>
                <span className="eyebrow !text-sage shrink-0">{b.tag}</span>
              </div>

              <p className="mt-4 text-ink/75">{SAMPLE}</p>

              <p className="mt-4 text-sm text-ink/50">{b.why}</p>

              <div className="mt-6 pt-5 border-t border-wine/10">
                <p className="eyebrow">Sunday, September 6</p>
                <p className="display text-xl mt-1.5">The Wedding</p>
                <p className="text-sm text-ink/55 mt-1">5:00 to 11:00 pm</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActive(b)
                  document.getElementById('full')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-6 w-full border border-wine/25 text-wine px-4 py-2.5 text-xs uppercase tracking-[0.16em] hover:bg-wine hover:text-cream transition-colors"
              >
                See the full page
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- full preview */}
      <div id="full" className="scroll-mt-20">
        <div className="sticky top-16 md:top-20 z-30 bg-cream/95 backdrop-blur-md border-y border-wine/10">
          <div className="content py-4 flex flex-wrap items-center gap-2">
            {BODIES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActive(b)}
                aria-pressed={active.id === b.id}
                className={`px-4 py-2.5 text-xs uppercase tracking-[0.16em] border transition-colors ${
                  active.id === b.id
                    ? 'bg-wine text-cream border-wine'
                    : 'border-wine/20 text-ink/60 hover:text-wine hover:border-wine/50'
                }`}
              >
                {b.name}
              </button>
            ))}
            <span className="text-sm text-ink/50 ml-2">Cormorant + {active.name}</span>
          </div>
        </div>

        <div className={active.id}>
          <section className="content pt-14 md:pt-20 pb-12 text-center">
            <p className="eyebrow">In celebration of</p>
            <div className="mt-6">
              <span className="display block text-[3.5rem] leading-[0.95] sm:text-8xl md:text-[8.5rem]">
                Mary
              </span>
              <span className="amp block text-5xl sm:text-6xl md:text-7xl my-0.5 md:my-1">
                &amp;
              </span>
              <span className="display block text-[3.5rem] leading-[0.95] sm:text-8xl md:text-[8.5rem]">
                Josh
              </span>
            </div>
            <div className="mt-8 flex flex-col items-center gap-1.5">
              <p className="eyebrow">Sunday, September 6, 2026</p>
              <p className="text-ink/60">Hazy Mountain Vineyards, Afton, Virginia</p>
            </div>
            <div className="mt-9">
              <Countdown />
            </div>
          </section>

          <section className="content pb-14">
            <div className="grid gap-px bg-wine/10 sm:grid-cols-3">
              {[
                ['See the schedule', 'Every start time, and the bus that leaves without you'],
                ['Join the WhatsApp', 'Where anything that changes gets posted first'],
                ['Share photos', 'Straight into our album. No app, no login'],
              ].map(([label, desc]) => (
                <div key={label} className="bg-cream p-7 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="display text-2xl md:text-[1.75rem] leading-tight">{label}</h2>
                    <span className="text-wine/30" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <p className="mt-2.5 text-ink/60 text-[0.95rem]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="content pb-20">
            <div className="grid gap-12 md:grid-cols-3">
              {DAYS.map((day) => (
                <div key={day.key}>
                  <p className="eyebrow">{day.label}</p>
                  <p className="display text-3xl mt-2">{day.date}</p>
                  <ul className="mt-6 space-y-4">
                    {eventsForDay(day.key).map((e) => (
                      <li key={e.slug} className="flex gap-4">
                        <span
                          className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                            e.kind === 'shuttle' ? 'bg-sage' : 'bg-wine'
                          }`}
                          aria-hidden="true"
                        />
                        <div>
                          <p className={e.kind === 'shuttle' ? 'text-ink/55' : ''}>{e.name}</p>
                          <p className="text-sm text-ink/45">{e.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-cream-deep/40 py-16">
            <div className="content-narrow text-center">
              <p className="eyebrow">A note from us</p>
              <h2 className="display text-4xl md:text-6xl mt-4">Thank you</h2>
              <p className="mt-8 text-ink/75 leading-[1.85]">
                A wedding is a strange thing to ask of people. We asked you to look at a date
                eighteen months out, then take days off work, book flights, drive over a
                mountain, and stand in a field in Virginia in September humidity, all so you
                could watch us say a few sentences to each other.
              </p>
              <p className="display-sentence text-3xl md:text-4xl py-6 !text-wine">
                And you said yes. All 180 of you said yes.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="content py-16 text-center">
        <p className="text-ink/55 max-w-xl mx-auto">
          Tell me if you want a different one and I will swap it. Currently live: Cormorant.
        </p>
      </div>
    </>
  )
}
