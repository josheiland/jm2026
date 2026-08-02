import Link from 'next/link'
import Countdown from '@/components/Countdown'
import Photo from '@/components/Photo'
import HappeningNow from '@/components/HappeningNow'
import Ridgeline from '@/components/Ridgeline'
import WhatsAppButton from '@/components/WhatsAppButton'
import { DAYS, EVENTS, eventsForDay } from '@/lib/events'
import { STORY_CLOSER } from '@/lib/content'
import { WHATSAPP_INVITE } from '@/lib/config'
import guestData from '@/data/guests.json'

// The three things people came here to do, first thing on the page.
const QUICK_LINKS = [
  {
    href: '/photos',
    label: 'Drop your photos',
    desc: 'Straight into our album. No app, no login.',
  },
  {
    href: WHATSAPP_INVITE || '/faq',
    label: 'Join the group chat',
    desc: 'Where we post anything that changes.',
    external: Boolean(WHATSAPP_INVITE),
  },
  {
    href: '/schedule',
    label: 'See the schedule',
    desc: 'Every start time, and the bus you cannot miss.',
  },
]

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
            <p className="text-ink/60">Hazy Mountain Vineyards, Afton, Virginia</p>
          </div>

          <div className="mt-9 fade-up" style={{ animationDelay: '240ms' }}>
            <Countdown />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- the three things */}
      <section className="content pb-14">
        <div className="grid gap-px bg-wine/10 sm:grid-cols-3">
          {QUICK_LINKS.map((l, i) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="display text-2xl md:text-[1.75rem] leading-tight">{l.label}</h2>
                  <span
                    className="text-wine/30 group-hover:text-wine group-hover:translate-x-1 transition-all shrink-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <p className="mt-2.5 text-ink/60 text-[0.95rem]">{l.desc}</p>
              </>
            )
            const cls =
              'group bg-cream p-7 md:p-8 hover:bg-cream-soft transition-colors fade-up block'
            const style = { animationDelay: `${i * 70}ms` }

            return l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
                {inner}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className={cls} style={style}>
                {inner}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Full-bleed band. The only landscape frame they have. */}
      <div className="relative">
        <Photo name="hero-dock" sizes="100vw" priority imgClassName="max-h-[62vh]" />
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
                      <p className={e.kind === 'shuttle' ? 'text-ink/55' : ''}>{e.name}</p>
                      <p className="text-sm text-ink/45">{e.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 text-sm text-ink/50">
          <Link href="/schedule" className="text-wine link-underline">
            Full schedule, with addresses and what to wear →
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------------- pictures */}
      <section className="bg-cream-deep/40 py-16 md:py-20">
        <div className="content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {(['story-track', 'story-skydive', 'story-mountains', 'story-proposal'] as const).map(
              (n) => (
                <Photo key={n} name={n} sizes="(max-width: 768px) 50vw, 25vw" />
              ),
            )}
          </div>
          <p className="mt-8 text-center display text-2xl md:text-3xl leading-snug max-w-2xl mx-auto">
            {STORY_CLOSER}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------- group chat */}
      <section className="relative">
        <Ridgeline className="rotate-180" />
        <div className="bg-cream-deep/50 py-16 md:py-20">
          <div className="content-narrow text-center">
            <p className="eyebrow">One group chat for the whole weekend</p>
            <h2 className="display text-3xl md:text-4xl mt-4">
              Questions, rides, lost sunglasses
            </h2>
            <p className="mt-4 text-ink/65">
              Fastest way to reach us, and the fastest way to find whoever is already at the bar.
              If anything moves, it gets posted here first.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ thank you */}
      <section className="content py-20 md:py-24 text-center">
        <p className="amp text-5xl text-wine/25" aria-hidden="true">
          &amp;
        </p>
        <p className="display text-3xl md:text-4xl mt-4 max-w-2xl mx-auto leading-snug">
          {EVENTS.filter((e) => e.kind !== 'shuttle').length} gatherings,{' '}
          {guestData.totalSeated} of our favourite people, one very long-awaited weekend.
        </p>
        <Link
          href="/thank-you"
          className="inline-block mt-8 eyebrow text-wine hover:text-wine-deep transition-colors"
        >
          A note from us →
        </Link>
      </section>
    </>
  )
}
