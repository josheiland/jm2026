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

export default function PhotosPage() {
  const enabled = readConfig() !== null

  return (
    <>
      <PageHeader
        eyebrow="The guest album"
        title="Share Your Photos"
        lede="Our photographer is extraordinary and can still only be in one place at a time. You will see things she won't. Please send them to us."
      />

      <div className="content pb-16">
        <Uploader enabled={enabled} />
      </div>


      {/* ---------------------------------------------------------------- notes */}
      <section className="content py-16 text-center">
        <p className="text-ink/70 max-w-xl mx-auto">
          Video is very welcome and there is no real size limit. Nothing you upload appears
          publicly. If something will not go through it may be the wifi, and you are welcome to
          drop it in the WhatsApp or text it to us instead.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton variant="inline" />
        </div>
      </section>
    </>
  )
}
