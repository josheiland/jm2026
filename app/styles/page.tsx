'use client'

import { useState } from 'react'
import Countdown from '@/components/Countdown'
import { DAYS, eventsForDay } from '@/lib/events'

/**
 * Side-by-side comparison of the type systems, using the real homepage markup so
 * what you see is what ships. Switching only swaps a class; every component already
 * reads its fonts from CSS variables.
 */

const THEMES = [
  {
    id: '',
    name: 'Bodoni',
    tag: 'Current',
    note: 'High-contrast editorial serif with a geometric sans. Sharp, fashion-magazine. The thin strokes get delicate at small sizes.',
    pairing: 'Bodoni Moda + Jost',
  },
  {
    id: 'theme-cormorant',
    name: 'Cormorant',
    tag: 'Softest',
    note: 'Light, classical, the most traditionally bridal of the four. Wide letterspacing and airy weights. Reads as calm rather than bold.',
    pairing: 'Cormorant Garamond + Lato',
  },
  {
    id: 'theme-fraunces',
    name: 'Fraunces',
    tag: 'Warmest',
    note: 'A soft serif with deliberate quirks in the letterforms. Friendly and a bit playful, which suits the jokes better than Bodoni does.',
    pairing: 'Fraunces + Jost',
  },
  {
    id: 'theme-baskerville',
    name: 'Baskerville',
    tag: 'Most classic',
    note: 'The safe, handsome, book-jacket choice. Heavier on the page than Cormorant, more familiar than Fraunces. Ages well.',
    pairing: 'Libre Baskerville + Lato',
  },
  {
    id: 'theme-modern',
    name: 'Modern',
    tag: 'No serif',
    note: 'One sans throughout, separated by weight and very wide tracking. Architectural and current. The biggest departure from your Zola page.',
    pairing: 'Jost only',
  },
]

export default function StylesPage() {
  const [active, setActive] = useState(THEMES[0])

  return (
    <>
      {/* ------------------------------------------------------------- switcher */}
      <div className="sticky top-16 md:top-20 z-30 bg-cream/95 backdrop-blur-md border-y border-wine/10">
        <div className="content py-4">
          <div className="flex flex-wrap items-center gap-2">
            {THEMES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setActive(t)}
                aria-pressed={active.name === t.name}
                className={`px-4 py-2.5 text-xs uppercase tracking-[0.16em] border transition-colors ${
                  active.name === t.name
                    ? 'bg-wine text-cream border-wine'
                    : 'border-wine/20 text-ink/60 hover:text-wine hover:border-wine/50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-sm text-wine">{active.pairing}</p>
            <p className="text-sm text-ink/55 max-w-2xl">{active.note}</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- preview */}
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
              ['Your photos', 'Straight into our album. No app, no login'],
              ['Join the WhatsApp', 'Where anything that changes gets posted first'],
              ['See the schedule', 'Every start time, and the bus that leaves without you'],
            ].map(([label, desc]) => (
              <div key={label} className="group bg-cream p-7 md:p-8">
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
              eighteen months out, then take days off work, book flights, drive over a mountain,
              and stand in a field in Virginia in September humidity, all so you could watch us
              say a few sentences to each other.
            </p>
            <p className="display text-3xl md:text-4xl leading-snug py-6 text-wine">
              And you said yes. All 180 of you said yes.
            </p>
          </div>
        </section>
      </div>

      <div className="content py-16 text-center">
        <p className="text-ink/55">
          Tell me which one and I will apply it everywhere. Mixing is fine too, for instance
          Cormorant headings with the current body text.
        </p>
      </div>
    </>
  )
}
