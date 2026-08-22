'use client'

import { useMemo, useState } from 'react'
import RichText from './RichText'
import type { Faq } from '@/lib/content'

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const filtered = useMemo(
    () => (q ? faqs.filter((f) => (f.q + ' ' + f.a).toLowerCase().includes(q)) : faqs),
    [q, faqs],
  )

  const topics = useMemo(() => {
    const order: Faq['topic'][] = [
      'Getting around',
      'The day itself',
      'What to wear',
      'Food & drink',
      'Everything else',
    ]
    return order
      .map((topic) => ({ topic, items: filtered.filter((f) => f.topic === topic) }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  return (
    <div>
      <label className="mt-[18px] flex items-center gap-3 border border-wine/30 px-4 py-3.5">
        <span className="sr-only">Search the FAQs</span>
        <span className="text-wine-soft" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “bus”, “photos”, “what do I wear”"
          className="w-full bg-transparent font-ui !text-[15px] text-ink placeholder:text-ink/50 outline-none"
        />
      </label>

      {filtered.length === 0 && (
        <p className="mt-10 max-w-lg text-ink/70">
          Nothing matches that. <RichText text="Ask in [the WhatsApp](whatsapp)" /> and one of
          us will see it, probably faster than you expect.
        </p>
      )}

      <div className="mt-8">
        {topics.map((group) => (
          <section key={group.topic}>
            <p className="eyebrow mt-6 mb-1.5">{group.topic}</p>

            <div className="border-t border-wine/16">
              {group.items.map((f) => (
                /*
                  Only the open answer is filled, so on a fifteen-question page the eye
                  finds the one you tapped. The fill bleeds the full page width — hence
                  the negative margin against `.content`'s inline padding.
                */
                <details
                  key={f.q}
                  className="group border-b border-wine/16 -mx-6 px-6 open:bg-cream-deep md:-mx-10 md:px-10"
                  open={Boolean(q)}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="flex-1 text-[23px] leading-[1.3] text-wine-deep">{f.q}</span>
                    {/* Plus/minus, not a chevron: these rows are tall enough that a
                        rotating arrow reads as noise. */}
                    <span
                      className="mt-1 shrink-0 text-[18px] leading-none text-wine"
                      aria-hidden="true"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-5 text-[19px] leading-[1.6] text-ink/75">
                    <RichText text={f.a} />
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
