'use client'

import { useMemo, useState } from 'react'

interface Guest {
  name: string
  table: string
  tableLabel: string
  tableSort: number
  group: string
  headTable: boolean
}
interface Group {
  label: string
  blurb: string
  count: number
  members: Guest[]
}

// The head table used to be flagged with a diamond next to each name. It read as a
// typo more than a marker, so the Head Table card in the by-table view carries it now.

const fold = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function GuestList({
  groups,
  guests,
  tableCount,
}: {
  groups: Group[]
  guests: Guest[]
  tableCount: number
}) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'group' | 'table'>('group')

  const q = fold(query.trim())

  const matches = useMemo(
    () => (q ? guests.filter((g) => fold(g.name).includes(q)) : null),
    [q, guests],
  )

  const byTable = useMemo(() => {
    const map = new Map<string, Guest[]>()
    for (const g of guests) {
      if (!map.has(g.table)) map.set(g.table, [])
      map.get(g.table)!.push(g)
    }
    // Head table first, then 1 through 17.
    return [...map.entries()].sort((a, b) => a[1][0].tableSort - b[1][0].tableSort)
  }, [guests])

  return (
    <div>
      {/* controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <label className="relative flex-1 min-w-[16rem]">
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

        <div className="flex border border-wine/15" role="group" aria-label="View mode">
          {(['group', 'table'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={`px-5 py-3 text-xs uppercase tracking-[0.16em] transition-colors ${
                view === mode ? 'bg-wine text-cream' : 'text-ink/70 hover:text-wine'
              }`}
            >
              By {mode}
            </button>
          ))}
        </div>
      </div>

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
              it creatively, which is Mary's department. Tell us and we will fix it.
            </p>
          ) : (
            <ul className="mt-5 space-y-px bg-wine/10">
              {matches.map((g) => (
                <li
                  key={`${g.name}-${g.table}`}
                  className="bg-cream-soft px-5 py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                >
                  <span className="display text-xl">{g.name}</span>
                  <span className="text-sm text-ink/70">
                    {g.group} · {g.tableLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* grouped view */}
      {!matches && view === 'group' && (
        <div className="mt-14 space-y-16">
          {groups.map((group) => (
            <section key={group.label}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="display text-3xl md:text-4xl">{group.label}</h2>
                <p className="eyebrow">{group.count} people</p>
              </div>
              {group.blurb && (
                <p className="mt-2 text-ink/70 max-w-2xl text-pretty [overflow-wrap:anywhere]">
                  {group.blurb}
                </p>
              )}
              <div className="rule mt-5" />

              <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {group.members.map((g) => (
                  <li key={`${g.name}-${g.table}`} className="border-b border-wine/8 pb-2">
                    {g.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* table view */}
      {!matches && view === 'table' && (
        <div className="mt-14">
          <p className="text-ink/70 max-w-2xl">{tableCount} tables at the reception</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {byTable.map(([table, members]) => {
              const isHead = members[0].headTable
              return (
                <div
                  key={table}
                  className={`card p-6 ${isHead ? '!bg-blush/25 !border-wine/25 sm:col-span-2 lg:col-span-3' : ''}`}
                >
                  <p className="display text-2xl">{members[0].tableLabel}</p>
                  {isHead && (
                    <p className="mt-1.5 text-sm text-ink/70">
                      The wedding party, their people, and the two of us.
                    </p>
                  )}
                  <ul
                    className={`mt-4 space-y-1.5 text-ink/75 ${
                      isHead ? 'sm:columns-2 lg:columns-3' : ''
                    }`}
                  >
                    {members
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((m) => (
                        <li key={m.name}>{m.name}</li>
                      ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
