import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { POIS } from '@/lib/content'
import { mapsUrl } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Charlottesville',
  description: 'Our Charlottesville: where we ate, ran, studied and fell in love.',
}

const CATEGORIES = ['Eat & Drink', 'See', 'Move'] as const
type Category = (typeof CATEGORIES)[number]

/**
 * Tabs rather than three stacked sections: fifteen places fit inside one thumb-length
 * instead of four. The selection is a search param, not client state, so the page
 * stays server-rendered and a tab can be linked to.
 */
export default async function CharlottesvillePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const active: Category =
    CATEGORIES.find((c) => c === cat) ?? CATEGORIES[0]

  const items = POIS.filter((p) => p.category === active)

  return (
    <>
      <PageHeader eyebrow="Our Charlottesville" title="Things To Do" />

      <nav className="content flex gap-2 pt-5 pb-1" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const on = c === active
          return (
            <Link
              key={c}
              href={c === CATEGORIES[0] ? '/charlottesville' : `/charlottesville?cat=${encodeURIComponent(c)}`}
              scroll={false}
              aria-current={on ? 'true' : undefined}
              className={`font-ui text-[12px] uppercase tracking-[0.14em] px-4 py-3 transition-colors ${
                on
                  ? 'bg-wine-deep text-cream'
                  : 'border border-wine/30 text-wine hover:bg-wine/5'
              }`}
            >
              {c}
            </Link>
          )
        })}
      </nav>

      <div className="content pb-20">
        <ul className="mt-4 divide-y divide-wine/16 border-t border-wine/16">
          {items.map((p) => (
            <li key={p.name} className="py-4">
              <div className="flex items-baseline gap-4">
                <h2 className="display flex-1 text-[27px] md:text-3xl">{p.name}</h2>
                <a
                  href={mapsUrl(`${p.name}, ${p.address}, Charlottesville, VA`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-ui text-[12px] uppercase tracking-[0.12em] text-wine link-underline"
                >
                  Map ↗
                </a>
              </div>
              <p className="mt-1 font-ui text-[13px] text-ink/60">{p.address}</p>
              <p className="mt-2 text-[19px] leading-[1.55] text-ink/72">{p.desc}</p>
            </li>
          ))}
        </ul>

        {/* One instruction, on its own ground, so it is not read as a sixteenth place. */}
        <div className="mt-12 bg-cream-deep px-5 py-5 md:px-8 md:py-8">
          <p className="eyebrow">If you only do one thing</p>
          <p className="display-sentence mt-3 text-[29px] leading-[1.25] md:text-4xl">
            Walk the Lawn at dusk, then get a bagel in the morning.
          </p>
          <p className="mt-4 hidden text-ink/65 md:block">
            Rooms 45 and 47 were ours for a year, and we fostered an irresponsible number of
            puppies out of them. Monday morning we will all be back on that same grass with
            Bodo&apos;s, so you may as well scout it Saturday.
          </p>
        </div>
      </div>
    </>
  )
}
