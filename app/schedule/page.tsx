import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import AddToCalendar from '@/components/AddToCalendar'
import WholeWeekendButton from '@/components/WholeWeekendButton'
import RichText from '@/components/RichText'
import { DAYS, eventsForDay, mapsUrl, type WeddingEvent } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Everything happening between Saturday and Monday.',
}

/**
 * The time column is fixed-width and right-aligned on purpose: every time in the
 * weekend lands on one edge, so the page scans straight down instead of zig-zagging
 * around event names of different lengths.
 */
function TimeCell({ event, tone }: { event: WeddingEvent; tone: string }) {
  const [start, end] = event.time.split(' to ')
  return (
    <div className="w-[74px] shrink-0 grow-0 basis-[74px] text-right">
      <p
        className={`font-ui text-[15px] font-medium leading-snug ${tone}`}
      >
        {start}
      </p>
      {end && <p className="text-[13px] leading-snug text-ink/55">to {end}</p>}
    </div>
  )
}

/**
 * The buses are the only thing all weekend that leaves without you. They used to be
 * green; a warm neutral plus a hollow marker says "different kind of thing" without
 * putting a second hue in the palette. Filled dot = you are expected, hollow = transport.
 */
function Shuttle({ event }: { event: WeddingEvent }) {
  return (
    <li className="bg-cream-deep">
      <div className="flex gap-4 py-4">
        <TimeCell event={event} tone="text-wine-soft" />

        <div className="relative w-px shrink-0 bg-wine/18">
          <span
            className="absolute -left-[3.5px] top-[5px] box-border h-2 w-2 rounded-full border-[1.5px] border-wine-soft bg-cream-deep"
            aria-hidden="true"
          />
        </div>

        <div className="flex-1">
          <p className="display text-[20px]">{event.name}</p>
          <p className="mt-0.5 text-[17px] text-ink/68">{event.venue}</p>
          {event.showMap && (
            <a
              href={mapsUrl(event.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block text-wine link-underline"
            >
              {event.address}
            </a>
          )}
          {event.description && (
            <p className="mt-2 max-w-xl text-ink/75">
              <RichText text={event.description} />
            </p>
          )}
          {event.heads_up && (
            <p className="mt-3 max-w-xl border-l-2 border-wine-soft/60 pl-4 text-ink/80">
              {event.heads_up}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

function Major({ event }: { event: WeddingEvent }) {
  // The ceremony gets the only size variation in the rail — 10px against 8px.
  const wedding = event.kind === 'ceremony'

  return (
    <li>
      <div className="flex gap-4 py-4 md:py-5">
        <TimeCell event={event} tone="text-wine-deep" />

        <div className="relative w-px shrink-0 bg-wine/18">
          <span
            className={`absolute rounded-full bg-wine ${
              wedding ? '-left-[4.5px] top-[4px] h-2.5 w-2.5' : '-left-[3.5px] top-[5px] h-2 w-2'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="flex-1">
          <h3 className="display text-[26px] md:text-3xl">{event.name}</h3>
          <p className="mt-1 text-[18px] text-ink/75">{event.venue}</p>

          {event.attire && (
            <>
              <p className="eyebrow mt-2 !text-[12px]">{event.attire}</p>
              {event.attireNote && (
                <p className="mt-1 text-[17px] text-ink/65">{event.attireNote}</p>
              )}
            </>
          )}

          {event.description && (
            <p className="mt-3 max-w-xl leading-relaxed text-ink/70">{event.description}</p>
          )}

          {event.heads_up && (
            <p className="mt-3 max-w-xl border-l-2 border-wine/35 pl-4 text-ink/80">
              {event.heads_up}
            </p>
          )}

          {/*
            nowrap matters: without it "Add to calendar" breaks over two lines and the
            two pills stop matching height, which reads as a mistake.
          */}
          <div className="mt-3 flex flex-wrap gap-2">
            <AddToCalendar event={event} compact />
            <a
              href={mapsUrl(event.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap border border-wine/30 px-4 py-[9px] font-ui text-[12px] uppercase tracking-[0.12em] text-wine transition-colors hover:bg-wine hover:text-cream"
            >
              Directions
            </a>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function SchedulePage() {
  return (
    <>
      <PageHeader eyebrow="September 5 to 7, 2026" title="The Weekend" />

      <div className="content pt-10 pb-2">
        <WholeWeekendButton />
      </div>

      <div className="content pb-20">
        {DAYS.map((day) => (
          <section key={day.key} className="pt-10">
            <h2 className="display text-[30px] md:text-4xl">{day.label}</h2>

            <ol className="mt-3 divide-y divide-wine/16 border-t border-wine/16">
              {eventsForDay(day.key).map((e) =>
                e.kind === 'shuttle' ? (
                  <Shuttle key={e.slug} event={e} />
                ) : (
                  <Major key={e.slug} event={e} />
                ),
              )}
            </ol>
          </section>
        ))}
      </div>
    </>
  )
}
