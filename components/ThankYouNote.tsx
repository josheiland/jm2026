import Photo from '@/components/Photo'
import { THANK_YOU } from '@/lib/content'
import data from '@/data/guests.json'

/**
 * Lives at the bottom of the homepage rather than on a page of its own. A thank-you
 * nobody navigates to is a thank-you nobody reads.
 */
export default function ThankYouNote() {
  return (
    <section id="thank-you" className="bg-cream-deep/40 py-20 md:py-28 scroll-mt-20">
      <div className="content-narrow">
        <p className="eyebrow text-center">A note from us</p>
        <h2 className="display text-4xl md:text-6xl mt-4 text-center">{THANK_YOU.heading}</h2>

        <Photo name="joy-vineyard" sizes="(max-width: 768px) 100vw, 44rem" className="mt-12" />

        <div className="mt-12 space-y-6 text-ink/75 leading-[1.85]">
          <p className="display-sentence text-3xl md:text-4xl">{THANK_YOU.salutation}</p>
          {THANK_YOU.body.map((p, i) => (
            <p
              key={i}
              className={
                i === THANK_YOU.pullQuote
                  ? 'display-sentence !text-3xl md:!text-4xl text-center py-4 !text-wine'
                  : undefined
              }
            >
              {p.replace('{count}', String(data.guestCount))}
            </p>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-ink/70 italic">{THANK_YOU.signoff}</p>
          <p className="display text-4xl md:text-5xl mt-3">{THANK_YOU.names}</p>
        </div>
      </div>
    </section>
  )
}
