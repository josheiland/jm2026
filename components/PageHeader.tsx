import Link from 'next/link'
import { RidgeEdge } from './Ridgeline'

/**
 * The horizon header. Every inner page opens on the same dark block with the ridge
 * biting up into it from below, so you always know you are one level down from
 * home without reading anything.
 *
 * It runs up behind the nav deliberately: a cream strip above the block reads as a
 * gap, and the block is meant to be the top of the screen.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede?: string
}) {
  return (
    <header className="relative -mt-16 bg-wine-deep pt-16 md:-mt-20 md:pt-20">
      <div className="content pt-5 pb-14 md:pt-8 md:pb-24">
        <Link
          href="/"
          className="inline-block text-[20px] leading-none text-blush transition-opacity hover:opacity-70"
          aria-label="Back to home"
        >
          <span aria-hidden="true">←</span>
        </Link>

        <p className="eyebrow !text-blush/85 mt-4 fade-up">{eyebrow}</p>

        <h1
          className="display !text-cream text-[44px] md:text-7xl mt-2.5 fade-up"
          style={{ animationDelay: '60ms' }}
        >
          {title}
        </h1>

        {lede && (
          <p
            className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/75 md:text-xl fade-up"
            style={{ animationDelay: '120ms' }}
          >
            {lede}
          </p>
        )}
      </div>

      {/* Cream, so the mountains are the page arriving rather than a picture of one. */}
      <RidgeEdge fill="#f5efe8" className="-bottom-px h-[30px] md:h-[46px]" />
    </header>
  )
}
