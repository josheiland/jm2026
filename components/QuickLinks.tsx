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
    desc: 'Anything you take over the weekend, straight into our album',
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
    <section className="content py-8 md:py-10">
      <div className={`grid gap-px bg-wine/10 ${cols}`}>
        {only.map((key, i) => {
          const l = LINKS[key]
          /*
            The arrow sits on the right edge rather than inside the heading: thumbs
            look for it there, and pulling it out keeps the three headings optically
            aligned on the left. Rows clear 56px.
          */
          const inner = (
            <>
              <div className="flex-1">
                <h2 className="display text-[26px] leading-tight md:text-[1.75rem]">{l.label}</h2>
                <p className="mt-1.5 text-ink/70">{l.desc}</p>
              </div>
              <span
                className="shrink-0 text-[20px] leading-none text-wine transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </>
          )
          const cls =
            'group flex min-h-14 items-center gap-4 bg-cream p-5 transition-colors hover:bg-cream-soft fade-up'
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
