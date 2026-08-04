import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import AddToCalendar from '@/components/AddToCalendar'
import Photo from '@/components/Photo'
import WholeWeekendButton from '@/components/WholeWeekendButton'
import RichText from '@/components/RichText'
import { DAYS, eventsForDay, mapsUrl, type WeddingEvent } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Everything happening between Saturday and Monday.',
}

/**
 * The buses are the only thing all weekend that leaves without you, so this is set
 * close to the size of a main event rather than as small print.
 */
function Shuttle({ event }: { event: WeddingEvent }) {
  return (
    <li className="relative pl-8 md:pl-10 py-6">
      <span
        className="absolute left-0 top-[2.1rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sage ring-4 ring-cream"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="display text-2xl md:text-3xl tabular-nums !text-sage">{event.time}</p>
        <p className="text-ink/80 text-lg">{event.name}</p>
      </div>
      <p className="mt-1.5 text-ink/70">{event.venue}</p>
      {event.showMap && (
        <a
          href={mapsUrl(event.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-0.5 text-wine link-underline"
        >
          {event.address}
        </a>
      )}
      {event.description && (
        <p className="mt-3 text-ink/75 max-w-xl">
          <RichText text={event.description} />
        </p>
      )}
      {event.heads_up && (
        <p className="mt-4 border-l-2 border-sage/60 pl-4 text-ink/80 max-w-xl">
          {event.heads_up}
        </p>
      )}
      <div className="mt-4">
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
          className="inline-block text-wine link-underline"
        >
          {event.address}
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
            {event.attireNote && <span className="text-ink/70">. {event.attireNote}</span>}
          </p>
        </div>
      )}

      {event.image && (
        <Photo
          name={event.image}
          sizes="(max-width: 768px) 100vw, 36rem"
          className="mt-6 max-w-xl"
          caption="Garden VIII is the walled garden behind Pavilion VIII, on the East Lawn."
        />
      )}

      {event.heads_up && (
        <p className="mt-5 card px-5 py-4 text-ink/75 max-w-xl">{event.heads_up}</p>
      )}

      <AddToCalendar event={event} />
    </li>
  )
}

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        eyebrow="September 5 to 7, 2026"
        title="The Weekend"
      />

      <div className="content pb-8">
        <WholeWeekendButton />
      </div>

      <div className="content pb-20">
        {DAYS.map((day) => (
          <section key={day.key} className="pt-16 first:pt-8">
            <div className="pb-2">
              <h2 className="display text-4xl md:text-5xl">{day.long}</h2>
            </div>
            <div className="rule" />

            <ol className="mt-6 border-l border-wine/15 ml-1">
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


      <Photo name="vineyard-kiss" sizes="100vw" imgClassName="max-h-[34rem] object-center" />
    </>
  )
}
