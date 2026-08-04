import Link from 'next/link'
import Countdown from '@/components/Countdown'
import Photo from '@/components/Photo'
import HappeningNow from '@/components/HappeningNow'
import QuickLinks from '@/components/QuickLinks'
import ThankYouNote from '@/components/ThankYouNote'
import { DAYS, eventsForDay } from '@/lib/events'

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="content pt-14 md:pt-20 pb-12 md:pb-16 text-center">
          <p className="eyebrow fade-up">In celebration of</p>

          <h1 className="mt-6 fade-up" style={{ animationDelay: '80ms' }}>
            <span className="sr-only">Mary and Josh</span>
            <span
              className="display block text-[3.5rem] leading-[0.95] sm:text-8xl md:text-[8.5rem]"
              aria-hidden="true"
            >
              Mary
            </span>
            <span
              className="amp block text-5xl sm:text-6xl md:text-7xl my-0.5 md:my-1"
              aria-hidden="true"
            >
              &amp;
            </span>
            <span
              className="display block text-[3.5rem] leading-[0.95] sm:text-8xl md:text-[8.5rem]"
              aria-hidden="true"
            >
              Josh
            </span>
          </h1>

          <div
            className="mt-8 flex flex-col items-center gap-1.5 fade-up"
            style={{ animationDelay: '160ms' }}
          >
            <p className="eyebrow">Sunday, September 6, 2026</p>
            <p className="text-ink/70">Hazy Mountain Vineyards, Afton, Virginia</p>
          </div>

          <div className="mt-9 fade-up" style={{ animationDelay: '240ms' }}>
            <Countdown />
          </div>
        </div>
      </section>

      {/* The three things people came here to do */}
      <QuickLinks />

      {/* Full-bleed band. The only landscape frame they have. */}
      <div className="relative">
        <Photo
          name="hero-dock"
          sizes="100vw"
          priority
          imgClassName="max-h-[34rem] object-center"
        />
      </div>

      <HappeningNow />

      {/* --------------------------------------------------------- at a glance */}
      <section className="content py-20 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {DAYS.map((day, i) => (
            <div key={day.key} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
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
                      <p className={e.kind === 'shuttle' ? 'text-ink/70' : ''}>{e.name}</p>
                      <p className="text-sm text-ink/70">{e.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 text-sm text-ink/70">
          <Link href="/schedule" className="text-wine link-underline">
            Full schedule, with addresses and what to wear →
          </Link>
        </p>
      </section>


      <ThankYouNote />
    </>
  )
}
