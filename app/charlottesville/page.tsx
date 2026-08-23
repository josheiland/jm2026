import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import Photo from '@/components/Photo'
import { POIS } from '@/lib/content'
import { mapsUrl } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Charlottesville',
  description: 'Our Charlottesville: where we ate, ran, studied and fell in love.',
}

const CATEGORIES = ['Eat & Drink', 'See', 'Move'] as const

export default function CharlottesvillePage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Charlottesville"
        title="Things To Do"
      />

      <div className="content pb-20">
        {CATEGORIES.map((cat) => {
          const items = POIS.filter((p) => p.category === cat)
          if (!items.length) return null

          return (
            <section key={cat} className="pt-12 first:pt-0">
              <h2 className="eyebrow">{cat}</h2>
              <div className="rule mt-4" />

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {items.map((p) => (
                  <article key={p.name} className="group">
                    <h3 className="display text-2xl md:text-3xl">{p.name}</h3>
                    <a
                      href={mapsUrl(`${p.name}, ${p.address}, Charlottesville, VA`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1.5 text-sm text-wine link-underline"
                    >
                      {p.address}
                    </a>
                    <p className="mt-3 text-ink/65 leading-relaxed">{p.desc}</p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <div className="mt-20 card p-8 md:p-12 grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-center">
          <div>
            <p className="eyebrow">If you only do one thing</p>
            <p className="display-sentence text-3xl md:text-4xl mt-3">
              Walk the Lawn on your way to a morning bagel.
            </p>
            <p className="mt-4 text-ink/65">
              Rooms 45 and 47 were ours for a year, and we fostered an
              irresponsible number of puppies out of them. Monday morning we will all be back on
              that same grass with Bodo's, so you may as well scout it Saturday.
            </p>
          </div>
          <Photo name="lawn-graduation" sizes="(max-width: 768px) 100vw, 24rem" />
        </div>
      </div>
    </>
  )
}
