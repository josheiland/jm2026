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
      <label className="relative block max-w-lg">
        <span className="sr-only">Search the FAQs</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search. Try “bus,” “photos,” “what do I wear,” “Mary said what?”"
          className="w-full bg-cream-soft border border-wine/15 pl-11 pr-4 py-3.5 placeholder:text-ink/55 focus:border-wine outline-none transition-colors"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-wine/40 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </label>

      {filtered.length === 0 && (
        <p className="mt-10 text-ink/70 max-w-lg">
          Nothing matches that. <RichText text="Ask in [the WhatsApp](whatsapp)" /> and one of
          us will see it, probably faster than you expect.
        </p>
      )}

      <div className="mt-14 space-y-14">
        {topics.map((group) => (
          <section key={group.topic}>
            <h2 className="display text-3xl">{group.topic}</h2>
            <div className="rule mt-4" />

            <div className="mt-2">
              {group.items.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-wine/10"
                  open={Boolean(q)}
                >
                  <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-xl md:text-2xl text-ink/90 group-open:text-wine transition-colors">
                      {f.q}
                    </span>
                    <span
                      className="mt-1.5 shrink-0 text-wine/50 transition-transform duration-300 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-6 pr-10 text-ink/70 leading-relaxed max-w-2xl">
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
