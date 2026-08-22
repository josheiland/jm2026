import Link from 'next/link'
import Countdown from '@/components/Countdown'
import HazeWash from '@/components/HazeWash'
import HappeningNow from '@/components/HappeningNow'
import QuickLinks from '@/components/QuickLinks'
import ThankYouNote from '@/components/ThankYouNote'
import { DAYS, eventsForDay } from '@/lib/events'

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      {/*
        Cream falling to cream-deep, with the haze sitting in the darker end of it.
        The gradient is what makes three 5%-opacity ridges read as distance rather
        than as smudges.
      */}
      <section
        className="relative overflow-hidden"
        style={{
          /*
            The mock runs this to cream-deep at 100% because the dark band starts
            immediately below it. The band is silent until Sept 4, so outside the
            weekend the gradient has to resolve back to the page cream or it leaves
            a hard seam across the screen.
          */
          background:
            'linear-gradient(180deg, #F5EFE8 0%, #F2E9DE 55%, #EFE5D8 88%, #F5EFE8 100%)',
        }}
      >
        <HazeWash />

        <div className="content relative pt-9 pb-16 text-center md:pt-14 md:pb-20">
          <p className="eyebrow fade-up">September 5–7 · Charlottesville</p>

          <h1 className="mt-6 fade-up" style={{ animationDelay: '80ms' }}>
            <span className="sr-only">Mary and Josh</span>
            <span
              className="display block text-[3.5rem] leading-[0.92] sm:text-8xl md:text-[8.5rem]"
              aria-hidden="true"
            >
              Mary
            </span>
            <span
              className="amp block my-0.5 text-[1.925rem] sm:text-[3.3rem] md:text-[4.675rem] md:my-1"
              aria-hidden="true"
            >
              &amp;
            </span>
            <span
              className="display block text-[3.5rem] leading-[0.92] sm:text-8xl md:text-[8.5rem]"
              aria-hidden="true"
            >
              Josh
            </span>
          </h1>

          {/* Last thing in the cream. Nothing between it and the band. */}
          <div className="mt-[22px] fade-up" style={{ animationDelay: '160ms' }}>
            <Countdown />
          </div>
        </div>
      </section>

      {/* What is happening next, and where do I go — before any scrolling. */}
      <HappeningNow />

      {/* The three things people came here to do */}
      <QuickLinks />

      {/* --------------------------------------------------------- at a glance */}
      <section className="content py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {DAYS.map((day, i) => (
            <div key={day.key} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="eyebrow">{day.label}</p>
              <p className="display text-3xl mt-2">{day.date}</p>
              <ul className="mt-6 space-y-4">
                {eventsForDay(day.key).map((e) => (
                  <li key={e.slug} className="flex gap-4">
                    {/* Filled dot = you are expected. Hollow = transport. */}
                    <span
                      className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${
                        e.kind === 'shuttle'
                          ? 'border-[1.5px] border-wine-soft box-border'
                          : 'bg-wine'
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
