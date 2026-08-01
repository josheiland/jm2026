import type { Metadata } from 'next'
import Link from 'next/link'
import { THANK_YOU } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'A note from Mary and Josh.',
}

export default function ThankYouPage() {
  return (
    <article className="content-narrow py-20 md:py-32">
      <p className="eyebrow text-center fade-up">A note from us</p>

      <h1
        className="display text-5xl md:text-7xl mt-5 text-center fade-up"
        style={{ animationDelay: '60ms' }}
      >
        {THANK_YOU.heading}
      </h1>

      <div className="rule my-14" />

      <div className="space-y-7 text-lg text-ink/75 leading-[1.85]">
        {THANK_YOU.body.map((p, i) => (
          <p
            key={i}
            className={
              i === 1
                ? 'display !text-3xl md:!text-4xl !leading-snug text-center py-6 !text-wine'
                : undefined
            }
          >
            {p}
          </p>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-ink/60 italic">{THANK_YOU.signoff}</p>
        <p className="display text-4xl md:text-5xl mt-3">{THANK_YOU.names}</p>
        <p className="amp text-5xl text-wine/25 mt-6" aria-hidden="true">
          &amp;
        </p>
      </div>

      <div className="rule my-14" />

      <p className="text-center">
        <Link href="/photos" className="eyebrow text-wine hover:text-wine-deep transition-colors">
          Send us your photos →
        </Link>
      </p>
    </article>
  )
}
