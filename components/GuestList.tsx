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
      {/* Above the first group, so it is reachable without scrolling past 148 names. */}
      <label className="mt-[18px] flex items-center gap-3 border border-wine/30 px-4 py-3.5">
        <span className="sr-only">Search for a guest</span>
        <span className="text-wine-soft" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a name"
          className="w-full bg-transparent font-ui !text-[15px] text-ink placeholder:text-ink/50 outline-none"
        />
      </label>

      {/* search results */}
      {matches && (
        <div className="mt-8">
          <p className="eyebrow">
            {matches.length === 0
              ? 'No one by that name'
              : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
          </p>

          {matches.length === 0 ? (
            <p className="mt-4 max-w-lg text-ink/70">
              Try just a first name. If you still cannot find yourself, we have probably spelled
              it creatively, which is Mary&apos;s department. Tell us and we will fix it.
            </p>
          ) : (
            <ul className="mt-5 space-y-px bg-wine/10">
              {matches.map((g) => (
                <li
                  key={g.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-cream-soft px-5 py-4"
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
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.label}>
              <div className="flex items-baseline justify-between gap-4 border-b border-wine/20 pb-2">
                <h2 className="display text-[28px] md:text-4xl">{group.label}</h2>
                <span className="shrink-0 font-ui text-[12px] uppercase tracking-[0.16em] text-wine-soft/70">
                  {group.members.length}
                </span>
              </div>
              {group.blurb && (
                <p className="mt-3 max-w-2xl text-[18px] leading-[1.55] text-ink/65 text-pretty [overflow-wrap:anywhere]">
                  {group.blurb}
                </p>
              )}

              {/* Chips, so 148 names stop reading as a spreadsheet. */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.members.map((g) => (
                  <li key={g.name} className="bg-cream-deep px-3.5 py-2 text-[18px] text-wine-deep">
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
