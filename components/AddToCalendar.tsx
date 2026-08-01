import { googleCalUrl } from '@/lib/ics'
import type { WeddingEvent } from '@/lib/events'

/**
 * The closest thing to an automated reminder that actually reaches a guest's phone:
 * a calendar entry with an alarm already set on it. No app, no opt-in, no messaging API.
 */
export default function AddToCalendar({
  event,
  compact = false,
}: {
  event: WeddingEvent
  compact?: boolean
}) {
  const lead = event.kind === 'ceremony' ? '2 hours' : '1 hour'

  return (
    <div className={compact ? 'flex flex-wrap items-center gap-x-4 gap-y-1' : 'mt-5'}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a
          href={`/api/ics?e=${event.slug}`}
          className="text-sm text-wine link-underline"
          download
        >
          Add to calendar
        </a>
        <a
          href={googleCalUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink/45 hover:text-wine transition-colors"
        >
          Google
        </a>
      </div>
      {!compact && (
        <p className="mt-1.5 text-xs text-ink/40">
          Comes with a reminder {lead} beforehand.
        </p>
      )}
    </div>
  )
}
