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
    d: 'The one from your table, mid-toast, that no professional was ever going to get.',
  },
  {
    n: '02',
    t: 'Drop it here',
    d: 'No app, no account, no login. Works on the phone in your hand right now.',
  },
  {
    n: '03',
    t: 'It lands in our album',
    d: 'Straight into our folder. Put your name on it and we will know who to thank.',
  },
]

export default function PhotosPage() {
  const enabled = readConfig() !== null

  return (
    <>
      <PageHeader
        eyebrow="The guest album"
        title="Share Your Photos"
        lede="Our photographer is extraordinary and can still only be in one place at a time. You will see things she won't. Send them to us."
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
                <p className="mt-2 text-ink/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- notes */}
      <section className="content py-16 text-center">
        <p className="text-ink/70 max-w-xl mx-auto">
          Video is welcome and there is no real size limit. Nothing you upload appears publicly.
          If it will not go through, it is the wifi, and you should drop it in the group chat
          instead or just text it to us.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton variant="inline" />
        </div>
      </section>
    </>
  )
}
