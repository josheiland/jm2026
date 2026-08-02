import { buildIcs } from '@/lib/ics'
import { EVENTS } from '@/lib/events'

export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const raw = params.get('e')
  const known = new Set(EVENTS.map((e) => e.slug))
  const slugs = raw?.split(',').map((s) => s.trim()).filter((s) => known.has(s)) ?? []

  const filename = slugs.length === 1 ? `${slugs[0]}.ics` : 'mary-and-josh-2026.ics'

  // `attachment` makes iOS Safari save the file to Files, so adding an event becomes
  // download, find, tap, open. Served inline it hands straight to the calendar app.
  // Desktop browsers download a text/calendar response either way.
  const disposition = params.has('inline') ? 'inline' : 'attachment'

  return new Response(buildIcs(slugs), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `${disposition}; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
