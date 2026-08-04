'use client'

import { useMemo, useState } from 'react'

/**
 * Table assignments are absent, and not merely hidden. The seating is meant to be a
 * surprise on the night, so the page component strips those fields before they reach
 * this component, which keeps them out of the page source as well as off the screen.
 */
interface Guest {
  name: string
  group: string
}
interface Group {
  label: string
  blurb: string
  members: Guest[]
}

const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function GuestList({ groups, guests }: { groups: Group[]; guests: Guest[] }) {
  const [query, setQuery] = useState('')
  const q = fold(query.trim())

  const matches = useMemo(
    () => (q ? guests.filter((g) => fold(g.name).includes(q)) : null),
    [q, guests],
  )

  return (
    <div>
      <label className="relative block max-w-md">
        <span className="sr-only">Search for a guest</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Look yourself up"
          className="w-full bg-cream-soft border border-wine/15 pl-11 pr-4 py-3.5 text-base text-ink placeholder:text-ink/55 focus:border-wine outline-none transition-colors"
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

      {/* search results */}
      {matches && (
        <div className="mt-10">
          <p className="eyebrow">
            {matches.length === 0
              ? 'No one by that name'
              : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
          </p>

          {matches.length === 0 ? (
            <p className="mt-4 text-ink/70 max-w-lg">
              Try just a first name. If you still cannot find yourself, we have probably spelled
              it creatively, which is Mary&apos;s department. Tell us and we will fix it.
            </p>
          ) : (
            <ul className="mt-5 space-y-px bg-wine/10">
              {matches.map((g) => (
                <li
                  key={g.name}
                  className="bg-cream-soft px-5 py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                >
                  <span className="display text-xl">{g.name}</span>
                  <span className="text-sm text-ink/70">{g.group}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* grouped by how we know them */}
      {!matches && (
        <div className="mt-14 space-y-16">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="display text-3xl md:text-4xl">{group.label}</h2>
              {group.blurb && (
                <p className="mt-2 text-ink/70 max-w-2xl text-pretty [overflow-wrap:anywhere]">
                  {group.blurb}
                </p>
              )}
              <div className="rule mt-5" />

              <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {group.members.map((g) => (
                  <li key={g.name} className="border-b border-wine/8 pb-2">
                    {g.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
