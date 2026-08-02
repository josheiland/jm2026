import { EVENTS, type WeddingEvent } from './events'

// Calendar files are the reminder system that actually works. A .ics with a VALARM
// puts a real alarm on the guest's own phone — no app, no opt-in, no messaging API.
// Times are emitted in UTC (Z) so there is no VTIMEZONE to get wrong.

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** RFC 5545 line folding: 75 chars max, continuations prefixed with a space. */
function fold(line: string) {
  if (line.length <= 75) return line
  const parts = [line.slice(0, 75)]
  let rest = line.slice(75)
  while (rest.length > 74) {
    parts.push(' ' + rest.slice(0, 74))
    rest = rest.slice(74)
  }
  if (rest.length) parts.push(' ' + rest)
  return parts.join('\r\n')
}

const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Minutes of lead time for the alarm — more warning for the things you can miss. */
function leadMinutes(e: WeddingEvent) {
  if (e.kind === 'shuttle') return 60
  if (e.kind === 'ceremony') return 120
  return 60
}

function vevent(e: WeddingEvent, stamp: string) {
  const desc = [e.description, e.heads_up, e.attire ? `Attire: ${e.attire}` : null]
    .filter(Boolean)
    .join('\n\n')

  const lines = [
    'BEGIN:VEVENT',
    `UID:${e.slug}-2026@eilands2026`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${utc(e.start)}`,
    `DTEND:${utc(e.end)}`,
    fold(`SUMMARY:${esc(e.name)} · Mary & Josh`),
    fold(`LOCATION:${esc(`${e.venue}, ${e.address}`)}`),
    desc ? fold(`DESCRIPTION:${esc(desc)}`) : null,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    fold(`DESCRIPTION:${esc(`${e.name} · ${e.venue}`)}`),
    `TRIGGER:-PT${leadMinutes(e)}M`,
    'END:VALARM',
    'END:VEVENT',
  ]
  return lines.filter(Boolean).join('\r\n')
}

export function buildIcs(slugs?: string[]) {
  const stamp = utc(new Date().toISOString())
  const picked = slugs?.length ? EVENTS.filter((e) => slugs.includes(e.slug)) : EVENTS

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mary and Josh//Wedding 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Mary & Josh · September 2026',
    ...picked.map((e) => vevent(e, stamp)),
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

const title = (e: WeddingEvent) => `${e.name} · Mary & Josh`
const body = (e: WeddingEvent) => [e.description, e.heads_up].filter(Boolean).join('\n\n')

/** Google Calendar deep link. */
export function googleCalUrl(e: WeddingEvent) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title(e),
    dates: `${utc(e.start)}/${utc(e.end)}`,
    location: `${e.venue}, ${e.address}`,
    details: body(e),
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

/**
 * Outlook deep link. Outlook.com and Microsoft 365 are separate hosts on the same
 * path, and sending a personal account to the work host silently fails, so both are
 * offered rather than guessed at.
 */
export function outlookCalUrl(e: WeddingEvent, kind: 'live' | 'office' = 'live') {
  const host =
    kind === 'live' ? 'https://outlook.live.com' : 'https://outlook.office.com'
  const p = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title(e),
    startdt: new Date(e.start).toISOString(),
    enddt: new Date(e.end).toISOString(),
    location: `${e.venue}, ${e.address}`,
    body: body(e),
  })
  return `${host}/calendar/0/action/compose?${p}`
}

/** Whole weekend, for each provider. Google and Outlook only take one event per link. */
export const ICS_ALL = '/api/ics'
