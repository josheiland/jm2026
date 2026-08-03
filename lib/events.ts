// Single source of truth for the weekend.
//
// Everything here is sourced from the Zola site (zola.com/wedding/eilands2026) or
// from confirmed vendor notes. Times are written as ISO strings with an explicit
// -04:00 offset: Charlottesville is on EDT the whole weekend (US DST 2026 runs
// Mar 8 – Nov 1), so the offset is constant and no timezone library is needed.
// Pinning the offset means the countdown and "happening now" logic are correct
// for a guest sitting in California, London, or Kigali.

export const ET = '-04:00'

export type EventKind = 'party' | 'ceremony' | 'shuttle' | 'brunch'

export interface WeddingEvent {
  slug: string
  name: string
  kind: EventKind
  /** Short label for the timeline rail. */
  time: string
  start: string
  end: string
  day: 'sat' | 'sun' | 'mon'
  venue: string
  address: string
  /** Google Maps needs the full "name, address" string to land on the right pin. */
  mapQuery: string
  attire?: string
  attireNote?: string
  description?: string
  /** Rendered as a callout — the things people actually get wrong. */
  heads_up?: string
}

export const WEDDING_DATE = `2026-09-06T17:00:00${ET}`

export const DAYS = [
  { key: 'sat', label: 'Saturday', date: 'September 5', long: 'Saturday, September 5, 2026' },
  { key: 'sun', label: 'Sunday', date: 'September 6', long: 'Sunday, September 6, 2026' },
  { key: 'mon', label: 'Monday', date: 'September 7', long: 'Monday, September 7, 2026' },
] as const

export const EVENTS: WeddingEvent[] = [
  {
    slug: 'welcome-party',
    name: 'Welcome Party',
    kind: 'party',
    time: '4:00 to 8:00 pm',
    start: `2026-09-05T16:00:00${ET}`,
    end: `2026-09-05T20:00:00${ET}`,
    day: 'sat',
    venue: 'Starr Hill Brewery Downtown at the Dairy Market',
    address: '946 Grady Ave, Suite 101, Charlottesville, VA 22903',
    mapQuery: 'Starr Hill Brewery Downtown, 946 Grady Ave, Charlottesville, VA 22903',
    attire: 'Elevated casual',
    attireNote: 'Relaxed, polished, and festive.',
    description:
      'Drop by whenever. Appetizers and drinks from 4, then a full buffet dinner from around 6. This is dinner, so come hungry.',
    heads_up: 'No bus for this one. The Dairy Market is a walk or a short ride from the West Main hotels.',
  },
  {
    slug: 'shuttle-out',
    name: 'Shuttle to the Vineyard',
    kind: 'shuttle',
    time: '4:15 pm',
    start: `2026-09-06T16:15:00${ET}`,
    end: `2026-09-06T16:50:00${ET}`,
    day: 'sun',
    venue: 'Stacey Hall',
    address: '1105 West Main Street, Charlottesville, VA 22903',
    mapQuery: 'Stacey Hall, 1105 W Main St, Charlottesville, VA 22903',
    description:
      'Buses load at Stacey Hall, directly across West Main from The Draftsman, and every one of them leaves at 4:15. Staying elsewhere on West Main? It is only a few minutes’ walk. They drop you back in the same spot at the end of the night.',
    heads_up:
      'They all leave at 4:15. Not 4:20, not 4:30. If you are anything like Mary, treat that as 3:45.',
  },
  {
    slug: 'wedding',
    name: 'The Wedding',
    kind: 'ceremony',
    time: '5:00 to 11:00 pm',
    start: `2026-09-06T17:00:00${ET}`,
    end: `2026-09-06T23:00:00${ET}`,
    day: 'sun',
    venue: 'Hazy Mountain Vineyards & Brewery',
    address: '240 Hazy Mountain Ln, Afton, VA 22920',
    mapQuery: 'Hazy Mountain Vineyards & Brewery, 240 Hazy Mountain Ln, Afton, VA 22920',
    attire: 'Summer formal',
    attireNote: 'Long dresses and dark suits, mostly.',
    heads_up:
      'The ceremony is outdoors on a working vineyard, and grass beats stilettos every time. Block heels or heel stoppers will save you. But Mary will still be in stilettos.',
  },
  {
    slug: 'shuttle-early',
    name: 'Early Bus Back',
    kind: 'shuttle',
    time: '9:30 pm',
    start: `2026-09-06T21:30:00${ET}`,
    end: `2026-09-06T22:05:00${ET}`,
    day: 'sun',
    venue: 'Hazy Mountain to Stacey Hall',
    address: '240 Hazy Mountain Ln, Afton, VA 22920',
    mapQuery: 'Hazy Mountain Vineyards & Brewery, 240 Hazy Mountain Ln, Afton, VA 22920',
    description: 'The lame one. Straight back to where the bus picked you up.',
  },
  {
    slug: 'shuttle-late',
    name: 'Late Bus Back',
    kind: 'shuttle',
    time: '11:00 pm',
    start: `2026-09-06T23:00:00${ET}`,
    end: `2026-09-06T23:35:00${ET}`,
    day: 'sun',
    venue: 'Hazy Mountain to Stacey Hall',
    address: '240 Hazy Mountain Ln, Afton, VA 22920',
    mapQuery: 'Hazy Mountain Vineyards & Brewery, 240 Hazy Mountain Ln, Afton, VA 22920',
    description:
      'Leaves when the reception ends and drops where it picked you up, a short walk from the after party.',
  },
  {
    slug: 'after-party',
    name: 'After Party',
    kind: 'party',
    time: '11:30 pm to 1:00 am',
    start: `2026-09-06T23:30:00${ET}`,
    end: `2026-09-07T01:00:00${ET}`,
    day: 'sun',
    venue: 'The Corner',
    address: 'The Corner, Charlottesville, VA 22903',
    mapQuery: 'The Corner, Charlottesville, VA 22903',
    description:
      'Back on the Corner, exactly where this all started. The late bus drops a short walk away. We will post the specific bar in the group chat once we lock it.',
  },
  {
    slug: 'bagels',
    name: 'Bagels by the Lawn',
    kind: 'brunch',
    time: '10:00 am to 12:00 pm',
    start: `2026-09-07T10:00:00${ET}`,
    end: `2026-09-07T12:00:00${ET}`,
    day: 'mon',
    venue: 'The Lawn',
    address: '400 Emmet Street South, Charlottesville, VA 22903',
    mapQuery: 'The Lawn, University of Virginia, Charlottesville, VA 22903',
    attire: 'Groutfits, sweats, jammies',
    attireNote: 'All the cozies welcome',
    description: 'Roll out of bed and right onto the Lawn if you like. Breakfast is handled.',
    heads_up: 'Bodo’s, obviously. Josh will be eating a pastrami, egg and muenster on an everything.',
  },
]

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug)

export const eventsForDay = (day: 'sat' | 'sun' | 'mon') => EVENTS.filter((e) => e.day === day)

/** Sunset at the vineyard, for anyone planning golden-hour photos. */
export const SUNSET = { sat: '7:39 pm', sun: '7:37 pm', mon: '7:35 pm' }

export const mapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
