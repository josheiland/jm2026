import Link from 'next/link'
import { WHATSAPP_INVITE } from '@/lib/config'

/**
 * The three things guests actually open the site to do. Appears once under the hero
 * and again below the schedule, because most people never scroll back up.
 */

type Key = 'photos' | 'whatsapp' | 'schedule'

const LINKS: Record<Key, { href: string; label: string; desc: string; external?: boolean }> = {
  photos: {
    href: '/photos',
    label: 'Share photos',
    desc: 'Straight into our album. No app, no login',
  },
  whatsapp: {
    href: WHATSAPP_INVITE || '/faq',
    label: 'Join the WhatsApp',
    desc: 'Where anything that changes gets posted first',
    external: Boolean(WHATSAPP_INVITE),
  },
  schedule: {
    href: '/schedule',
    label: 'See the schedule',
    desc: 'Every start time, and the bus that leaves without you',
  },
}

export default function QuickLinks({
  only = ['schedule', 'whatsapp', 'photos'],
}: {
  only?: Key[]
}) {
  const cols = only.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'

  return (
    <section className="content pb-14">
      <div className={`grid gap-px bg-wine/10 ${cols}`}>
        {only.map((key, i) => {
          const l = LINKS[key]
          const inner = (
            <>
              <div className="flex items-start justify-between gap-4">
                <h2 className="display text-2xl md:text-[1.75rem] leading-tight">{l.label}</h2>
                <span
                  className="text-wine/30 group-hover:text-wine group-hover:translate-x-1 transition-all shrink-0"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="mt-2.5 text-ink/60">{l.desc}</p>
            </>
          )
          const cls = 'group bg-cream p-7 md:p-8 hover:bg-cream-soft transition-colors fade-up block'
          const style = { animationDelay: `${i * 70}ms` }

          return l.external ? (
            <a key={key} href={l.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
              {inner}
            </a>
          ) : (
            <Link key={key} href={l.href} className={cls} style={style}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
