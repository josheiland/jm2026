import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import { AIRPORTS, HOTELS } from '@/lib/content'
import { EVENTS, mapsUrl } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Travel & Stay',
  description: 'Airports, hotels, and how the shuttles work.',
}

const SHUTTLES = EVENTS.filter((e) => e.kind === 'shuttle')

export default function TravelPage() {
  const today = new Date()

  return (
    <>
      <PageHeader
        eyebrow="Getting here"
        title="Travel & Stay"
        lede="Charlottesville is small and walkable, the vineyard is 35 minutes west over the ridge, and there is a bus that solves the entire problem."
      />

      {/* ----------------------------------------------------------- shuttles */}
      <section className="content pb-20">
        <div className="card p-8 md:p-12">
          <p className="eyebrow">The important part</p>
          <h2 className="display text-3xl md:text-4xl mt-3">The Shuttles</h2>
          <p className="mt-4 text-ink/70 max-w-2xl leading-relaxed">
            Buses run between the West Main Street hotels and Hazy Mountain on Sunday. They pick
            up and drop off in front of{' '}
            <strong className="font-medium text-ink">The Draftsman</strong> — if you are at the
            Hampton Inn or the Courtyard, that is a two to four minute walk down the street.
          </p>

          <ol className="mt-10 space-y-px bg-wine/10">
            {SHUTTLES.map((s) => (
              <li
                key={s.slug}
                className="bg-cream-soft p-6 flex flex-wrap items-baseline gap-x-6 gap-y-2"
              >
                <p className="display text-2xl tabular-nums text-wine min-w-[9rem]">{s.time}</p>
                <div className="flex-1 min-w-[14rem]">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-ink/55 mt-0.5">{s.venue}</p>
                </div>
                <a
                  href={`/api/ics?e=${s.slug}`}
                  download
                  className="text-sm text-wine link-underline"
                >
                  Set a reminder
                </a>
              </li>
            ))}
          </ol>

          <p className="mt-8 border-l-2 border-wine/40 pl-5 text-ink/75">
            If you take one thing from this page: the last bus out leaves at{' '}
            <strong className="font-medium">4:45pm</strong>. Uber and Lyft are unreliable out in
            Afton, and it is a 35-minute drive back over the mountain at midnight.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- hotels */}
      <section className="content pb-20">
        <p className="eyebrow">Where everyone is staying</p>
        <h2 className="display text-4xl md:text-5xl mt-3">Hotels</h2>
        <p className="mt-4 text-ink/65 max-w-2xl">
          All three are on West Main Street, within a few minutes' walk of each other and of the
          shuttle stop. The Corner and the Lawn are both an easy walk from here too.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOTELS.map((h) => {
            const deadlinePassed =
              h.blockDeadline !== undefined && new Date(h.blockDeadline) < today

            return (
              <div key={h.name} className="card p-7 flex flex-col">
                {h.isShuttleStop && (
                  <p className="eyebrow !text-wine mb-3">Shuttle stop</p>
                )}
                <h3 className="display text-xl leading-snug">{h.name}</h3>

                <a
                  href={mapsUrl(`${h.name}, ${h.address}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-sm text-wine link-underline"
                >
                  {h.address} ↗
                </a>

                {h.rates && <p className="mt-4 text-sm text-ink/75">{h.rates}</p>}

                <p className="mt-4 text-sm text-ink/60 flex-1">{h.note}</p>

                <p className="mt-5 pt-4 border-t border-wine/10 text-sm">
                  {h.status === 'full' && (
                    <span className="text-ink/50">Our block here is full</span>
                  )}
                  {h.status === 'no-block' && (
                    <span className="text-ink/50">No block — book directly</span>
                  )}
                  {h.status === 'block' &&
                    (deadlinePassed ? (
                      <span className="text-wine">
                        Block deadline has passed — call the hotel and ask, rooms often remain
                      </span>
                    ) : (
                      <span className="text-sage">
                        Book by{' '}
                        {new Date(h.blockDeadline!).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>
                    ))}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------- airports */}
      <section className="content pb-20">
        <p className="eyebrow">Flying in</p>
        <h2 className="display text-4xl md:text-5xl mt-3">Airports</h2>

        <div className="mt-10 space-y-px bg-wine/10">
          {AIRPORTS.map((a) => (
            <div
              key={a.code}
              className="bg-cream-soft p-7 md:p-8 grid gap-x-8 gap-y-3 md:grid-cols-[7rem_1fr]"
            >
              <div>
                <p className="display text-3xl text-wine">{a.code}</p>
                {a.best && <p className="eyebrow !text-sage mt-1">{a.best}</p>}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-ink/50">{a.drive}</p>
                </div>
                <p className="mt-2 text-ink/65 text-[0.95rem] max-w-2xl">{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ driving */}
      <section className="content pb-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">If you are driving yourself</p>
            <h3 className="display text-2xl mt-3">Parking at the vineyard</h3>
            <p className="mt-3 text-ink/65">
              There is parking on site at Hazy Mountain, so driving is a perfectly good option —
              just plan to be parked by 4:40pm on Sunday, and think about the drive home before
              you order the second glass.
            </p>
            <a
              href={mapsUrl('Hazy Mountain Vineyards & Brewery, 240 Hazy Mountain Ln, Afton, VA 22920')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-wine link-underline"
            >
              Directions to Hazy Mountain ↗
            </a>
          </div>

          <div>
            <p className="eyebrow">Getting around town</p>
            <h3 className="display text-2xl mt-3">Charlottesville itself</h3>
            <p className="mt-3 text-ink/65">
              Everything on this website except the vineyard is within about a mile of West Main
              Street. Uber and Lyft work fine in town. Out in Afton they do not — that is what the
              buses are for.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
