import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import Uploader from '@/components/Uploader'
import WhatsAppButton from '@/components/WhatsAppButton'
import { readConfig } from '@/lib/drive'

export const metadata: Metadata = {
  title: 'Share Photos',
  description: 'Drop your photos and video straight into our album.',
}

// Read on the server so no Google configuration ever reaches the browser.
export const dynamic = 'force-dynamic'

const STEPS = [
  {
    n: '01',
    t: 'Take the picture',
    d: 'The one from your table, mid-toast, that no professional could have got.',
  },
  {
    n: '02',
    t: 'Drop it here',
    d: 'No app, no account, no login. It works on the phone in your hand right now.',
  },
  {
    n: '03',
    t: 'It lands in our album',
    d: 'Straight into our Drive folder, tagged with your name so we know who to thank.',
  },
]

export default function PhotosPage() {
  const enabled = readConfig() !== null

  return (
    <>
      <PageHeader
        eyebrow="The guest album"
        title="Share Your Photos"
        lede="Our photographer is extraordinary and will still only ever be in one place at a time. You will see things she won't. Please send them to us."
      />

      <div className="content pb-16">
        <Uploader enabled={enabled} />
      </div>

      {/* ------------------------------------------------------------ how it works */}
      <section className="bg-cream-deep/40 py-16 md:py-20">
        <div className="content">
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="display text-4xl text-wine/25">{s.n}</p>
                <h3 className="display text-xl mt-3">{s.t}</h3>
                <p className="mt-2 text-ink/60 text-[0.95rem]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- notes */}
      <section className="content py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">The small print</p>
            <ul className="mt-5 space-y-3 text-ink/70">
              <li className="flex gap-3">
                <span className="text-wine/40 shrink-0" aria-hidden="true">—</span>
                Video is very welcome, and there is no practical size limit. A long clip on hotel
                wifi will take a few minutes; leave the tab open.
              </li>
              <li className="flex gap-3">
                <span className="text-wine/40 shrink-0" aria-hidden="true">—</span>
                iPhone HEIC and Live Photos upload fine. So do screenshots of the group chat,
                which we would genuinely also like.
              </li>
              <li className="flex gap-3">
                <span className="text-wine/40 shrink-0" aria-hidden="true">—</span>
                Nothing you upload is shown publicly on this site. It goes into our private
                album and nowhere else.
              </li>
              <li className="flex gap-3">
                <span className="text-wine/40 shrink-0" aria-hidden="true">—</span>
                No deadline. Find something good in your camera roll in November? Still want it.
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">If something goes wrong</p>
            <p className="mt-5 text-ink/70">
              Upload sticking on a big video? It is almost always the wifi. Switch to cellular,
              or try again from the hotel later — nothing is lost by retrying, and duplicates are
              a much smaller problem than missing photos.
            </p>
            <p className="mt-4 text-ink/70">
              Still stuck, or would rather just send them to us directly?
            </p>
            <div className="mt-5">
              <WhatsAppButton variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
