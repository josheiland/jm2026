import Link from 'next/link'
import Ridgeline from './Ridgeline'
import WhatsAppButton from './WhatsAppButton'
import { ZOLA_URL } from '@/lib/content'

export default function Footer() {
  // The ridgeline's sky is transparent, so the footer carries the beige itself and the
  // gap above it is padding rather than margin. Same value as the thank-you section
  // above it on the homepage, so the two read as one continuous band down to the
  // mountaintops instead of breaking to cream.
  return (
    <footer className="relative z-10 bg-cream-deep/40 pt-24">
      <Ridgeline />
      <div className="bg-wine-deep text-cream/85">
        <div className="content py-16">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="display text-3xl text-cream">Mary</span>
                <span className="amp text-4xl text-blush">&</span>
                <span className="display text-3xl text-cream">Josh</span>
              </div>
              <p className="mt-3 text-sm text-cream/80">
                September 6, 2026
                <br />
                Hazy Mountain Vineyards · Afton, Virginia
              </p>
              <div className="mt-6">
                <WhatsAppButton variant="footer" />
              </div>
            </div>

            <nav aria-label="Footer">
              <p className="eyebrow !text-blush/70">The weekend</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  ['/schedule', 'Schedule'],
                  ['/photos', 'Share Photos'],
                  ['/guests', 'Who’s Coming'],
                  ['/charlottesville', 'Charlottesville'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="link-underline hover:text-cream">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="More">
              <p className="eyebrow !text-blush/70">More</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  ['/faq', 'FAQs'],
                  ['/#thank-you', 'A note from us'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="link-underline hover:text-cream">
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={ZOLA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline hover:text-cream"
                  >
                    Our Zola page ↗
                  </a>
                </li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </footer>
  )
}
