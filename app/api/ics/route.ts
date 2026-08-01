import { buildIcs } from '@/lib/ics'
import { EVENTS } from '@/lib/events'

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('e')
  const known = new Set(EVENTS.map((e) => e.slug))
  const slugs = raw?.split(',').map((s) => s.trim()).filter((s) => known.has(s)) ?? []

  const filename = slugs.length === 1 ? `${slugs[0]}.ics` : 'mary-and-josh-2026.ics'

  return new Response(buildIcs(slugs), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
