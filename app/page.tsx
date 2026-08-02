import Link from 'next/link'
import Countdown from '@/components/Countdown'
import Photo from '@/components/Photo'
import HappeningNow from '@/components/HappeningNow'
import Ridgeline from '@/components/Ridgeline'
import WhatsAppButton from '@/components/WhatsAppButton'
import { DAYS, EVENTS, eventsForDay } from '@/lib/events'
import { STORY_CLOSER, STORY_PARAGRAPHS } from '@/lib/content'
import guestData from '@/data/guests.json'

// Keyed to the paragraph each photo follows in STORY_PARAGRAPHS.
const STORY_PHOTOS: Record<number, { name: 'story-track' | 'story-skydive' | 'story-mountains' | 'story-proposal'; caption: string }> = {
  1: { name: 'story-track', caption: 'The running started early and never really stopped.' },
  2: { name: 'story-skydive', caption: 'Chicago. Still just friends, allegedly.' },
  3: { name: 'story-mountains', caption: 'The first of many trips where the plan was mostly “go together”.' },
  5: { name: 'story-proposal', caption: 'Georgia. She said yes faster this time.' },
}

const QUICK_LINKS = [
  {
    href: '/schedule',
    label: 'Schedule',
    desc: 'Three days, every start time, and the bus you cannot miss.',
  },
  {
    href: '/travel',
    label: 'Travel & Stay',
    desc: 'Airports, hotels on West Main, and how the shuttles work.',
  },
  {
    href: '/photos',
    label: 'Share Photos',
    desc: 'Drop your pictures and video straight into our album.',
  },
  {
    href: '/guests',
    label: 'Who’s Coming',
    desc: 'Everyone who said yes, and how each of you found your way to us.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="content pt-14 md:pt-24 pb-16 md:pb-24 text-center">
          <p className="eyebrow fade-up">Together with our families</p>

          <h1 className="mt-8 fade-up" style={{ animationDelay: '80ms' }}>
            <span className="sr-only">Mary and Josh</span>
            <span
              className="display block text-[3.5rem] leading-[0.95] sm:text-8xl md:text-[8.5rem]"
              aria-hidden="true"
            >
              Mary
            </span>
            <span
              className="amp block text-6xl sm:text-7xl md:text-8xl my-1 md:my-2"
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
            className="mt-10 flex flex-col items-center gap-1.5 fade-up"
            style={{ animationDelay: '160ms' }}
          >
            <p className="eyebrow">Sunday, September 6, 2026</p>
            <p className="text-ink/60">
              Hazy Mountain Vineyards · Afton, Virginia
            </p>
          </div>

          <div className="mt-14 fade-up" style={{ animationDelay: '240ms' }}>
            <Countdown />
          </div>

          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-4 fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <Link
              href="/schedule"
              className="bg-wine text-cream px-8 py-4 text-sm uppercase tracking-[0.14em] hover:bg-wine-deep transition-colors"
            >
              See the weekend
            </Link>
            <a
              href="/api/ics"
              download
              className="border border-wine/25 text-wine px-8 py-4 text-sm uppercase tracking-[0.14em] hover:bg-wine hover:text-cream transition-colors"
            >
              Add it all to your calendar
            </a>
          </div>
        </div>
      </section>

      {/* Full-bleed band under the type. The only landscape frame they have, and it
          carries the whole mood of the thing. */}
      <div className="relative">
        <Photo
          name="hero-dock"
          sizes="100vw"
          priority
          imgClassName="max-h-[68vh]"
        />
      </div>

      <HappeningNow />

      {/* --------------------------------------------------------- at a glance */}
      <section className="content py-20 md:py-28">
        <div className="rule mb-16" />
        <div className="grid gap-12 md:grid-cols-3">
          {DAYS.map((day, i) => {
            const dayEvents = eventsForDay(day.key)
            return (
              <div key={day.key} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="eyebrow">{day.label}</p>
                <p className="display text-3xl mt-2">{day.date}</p>
                <ul className="mt-6 space-y-4">
                  {dayEvents.map((e) => (
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
            )
          })}
        </div>

        <p className="mt-14 text-sm text-ink/50">
          <Link href="/schedule" className="text-wine link-underline">
            Full schedule, with addresses and dress codes →
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------------- our story */}
      <section className="bg-cream-deep/40 py-20 md:py-28">
        <div className="content-narrow">
          <p className="eyebrow text-center">How we got here</p>
          <h2 className="display text-4xl md:text-5xl mt-4 text-center">Our Story</h2>

          {/* Photos land on the beat they belong to — the run, the skydive, the
              trip, the proposal — rather than being pooled in a gallery. */}
          <div className="mt-12 space-y-6 text-ink/75 leading-[1.8]">
            {STORY_PARAGRAPHS.map((p, i) => (
              <div key={i} className="space-y-6">
                <p
                  className={
                    i === 0
                      ? 'first-letter:display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]'
                      : undefined
                  }
                >
                  {p}
                </p>
                {STORY_PHOTOS[i] && (
                  <Photo
                    name={STORY_PHOTOS[i]!.name}
                    caption={STORY_PHOTOS[i]!.caption}
                    sizes="(max-width: 768px) 100vw, 44rem"
                    className="!my-12"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rule my-12" />

          <div className="grid gap-8 sm:grid-cols-[1fr_1.1fr] items-center">
            <Photo name="story-ring" sizes="(max-width: 640px) 100vw, 22rem" />
            <p className="display text-2xl md:text-3xl leading-snug">{STORY_CLOSER}</p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- quick links */}
      <section className="content py-20 md:py-28">
        <div className="grid gap-px bg-wine/10 sm:grid-cols-2">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group bg-cream p-8 md:p-10 hover:bg-cream-soft transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="display text-2xl md:text-3xl">{l.label}</h3>
                <span
                  className="text-wine/30 group-hover:text-wine group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="mt-3 text-ink/60 text-[0.95rem]">{l.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- whatsapp */}
      <section className="relative">
        <Ridgeline className="rotate-180" />
        <div className="bg-cream-deep/50 py-16 md:py-20">
          <div className="content-narrow text-center">
            <p className="eyebrow">One group chat for the whole weekend</p>
            <h2 className="display text-3xl md:text-4xl mt-4">
              Questions, rides, lost sunglasses
            </h2>
            <p className="mt-4 text-ink/65">
              It is the fastest way to reach us, and the fastest way to find whoever else is
              already at the bar. We will post reminders there too — shuttle times especially.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ thank you */}
      <section className="content py-20 md:py-28 text-center">
        <p className="amp text-6xl text-wine/25" aria-hidden="true">
          &amp;
        </p>
        <p className="display text-3xl md:text-4xl mt-4 max-w-2xl mx-auto leading-snug">
          {EVENTS.filter((e) => e.kind !== 'shuttle').length} gatherings,{' '}
          {guestData.guestCount} of our favourite people, one very long-awaited weekend.
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
