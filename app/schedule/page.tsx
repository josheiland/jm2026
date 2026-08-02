import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import AddToCalendar from '@/components/AddToCalendar'
import Photo from '@/components/Photo'
import { DAYS, SUNSET, eventsForDay, mapsUrl, type WeddingEvent } from '@/lib/events'
import { MENU } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Everything happening between Saturday and Monday.',
}

const TAG_LABEL: Record<string, string> = {
  veg: 'vegetarian',
  vegan: 'vegan',
  gf: 'gluten-free',
  df: 'dairy-free',
}

function Shuttle({ event }: { event: WeddingEvent }) {
  return (
    <li className="relative pl-8 md:pl-10 py-5">
      <span
        className="absolute left-0 top-[1.85rem] h-2 w-2 -translate-x-1/2 rounded-full bg-sage ring-4 ring-cream"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="text-sm tabular-nums text-sage font-medium">{event.time}</p>
        <p className="text-ink/75">{event.name}</p>
      </div>
      <p className="mt-1 text-sm text-ink/50">{event.venue}</p>
      {event.description && (
        <p className="mt-2 text-sm text-ink/60 max-w-xl">{event.description}</p>
      )}
      {event.heads_up && (
        <p className="mt-3 border-l-2 border-sage/50 pl-4 text-sm text-ink/70 max-w-xl">
          {event.heads_up}
        </p>
      )}
      <div className="mt-3">
        <AddToCalendar event={event} compact />
      </div>
    </li>
  )
}

function Major({ event }: { event: WeddingEvent }) {
  return (
    <li className="relative pl-8 md:pl-10 py-8">
      <span
        className="absolute left-0 top-[2.9rem] h-3 w-3 -translate-x-1/2 rounded-full bg-wine ring-4 ring-cream"
        aria-hidden="true"
      />
      <p className="eyebrow">{event.time}</p>
      <h3 className="display text-3xl md:text-4xl mt-2">{event.name}</h3>

      <div className="mt-4 space-y-1">
        <p className="text-ink/80">{event.venue}</p>
        <a
          href={mapsUrl(event.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-wine link-underline"
        >
          {event.address} ↗
        </a>
      </div>

      {event.description && (
        <p className="mt-5 text-ink/70 max-w-xl leading-relaxed">{event.description}</p>
      )}

      {event.attire && (
        <div className="mt-5">
          <p className="eyebrow">Attire</p>
          <p className="mt-1.5 text-ink/80">
            {event.attire}
            {event.attireNote && (
              <span className="text-ink/55"> — {event.attireNote}</span>
            )}
          </p>
        </div>
      )}

      {event.heads_up && (
        <p className="mt-5 card px-5 py-4 text-sm text-ink/75 max-w-xl">{event.heads_up}</p>
      )}

      <AddToCalendar event={event} />
    </li>
  )
}

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        eyebrow="September 5–7, 2026"
        title="The Weekend"
        lede="Three days in Charlottesville. Come to all of it, come to some of it — the only thing with a hard deadline is the bus on Sunday afternoon."
      />

      <div className="content pb-8">
        <a
          href="/api/ics"
          download
          className="inline-flex items-center gap-2 border border-wine/25 text-wine px-6 py-3 text-sm uppercase tracking-[0.14em] hover:bg-wine hover:text-cream transition-colors"
        >
          Add the whole weekend to your calendar
        </a>
        <p className="mt-2.5 text-xs text-ink/45">
          Every event, each with a reminder already set — including an hour's warning before the
          shuttle.
        </p>
      </div>

      <div className="content pb-16">
        {DAYS.map((day) => {
          const events = eventsForDay(day.key)
          return (
            <section key={day.key} className="pt-16 first:pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4 pb-2">
                <h2 className="display text-4xl md:text-5xl">{day.long}</h2>
                <p className="text-sm text-ink/45">
                  Sunset {SUNSET[day.key]}
                </p>
              </div>
              <div className="rule" />

              <ol className="mt-6 border-l border-wine/15 ml-1">
                {events.map((e) =>
                  e.kind === 'shuttle' ? (
                    <Shuttle key={e.slug} event={e} />
                  ) : (
                    <Major key={e.slug} event={e} />
                  ),
                )}
              </ol>
            </section>
          )
        })}
      </div>

      {/* ------------------------------------------------------------ the menu */}
      <Photo name="vineyard-kiss" sizes="100vw" imgClassName="max-h-[52vh]" />

      <section className="bg-cream-deep/40 py-20 md:py-24">
        <div className="content-narrow">
          <p className="eyebrow text-center">Sunday dinner</p>
          <h2 className="display text-4xl md:text-5xl mt-4 text-center">The Menu</h2>
          <p className="mt-4 text-center text-ink/60 max-w-lg mx-auto">{MENU.note}</p>

          <div className="mt-14 space-y-12">
            {MENU.courses.map((course) => (
              <div key={course.course}>
                <p className="eyebrow text-center">{course.course}</p>
                <ul className="mt-5 space-y-5">
                  {course.items.map((item) => (
                    <li key={item.name} className="text-center">
                      <p className="display text-xl md:text-2xl">{item.name}</p>
                      <p className="mt-1 text-ink/60 text-[0.95rem] max-w-lg mx-auto">
                        {item.desc}
                      </p>
                      {item.tags.length > 0 && (
                        <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-sage">
                          {item.tags.map((t) => TAG_LABEL[t] ?? t).join(' · ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rule my-12" />
          <p className="text-center text-ink/65 italic">{MENU.wine}</p>
        </div>
      </section>
    </>
  )
}
