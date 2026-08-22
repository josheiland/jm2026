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
        lede="We can’t wait to relive the weekend from your point of view. Drop any and all photos and videos here. Thank you so big!"
      />

      <div className="content pb-6">
        <Uploader enabled={enabled} />
      </div>

      {/*
        The caveat sits under the button rather than in its own section four hundred
        pixels down, which is where it was and where nobody read it.
      */}
      <section className="content pb-20">
        <p className="max-w-xl text-[18px] leading-[1.6] text-ink/68">
          Video is very welcome and there is no real size limit. Nothing you upload appears
          publicly. If something will not go through it may be the wifi, and you are welcome to
          drop it in the WhatsApp or text it to us instead.
        </p>
        <div className="mt-5">
          <WhatsAppButton variant="pill" />
        </div>
      </section>
    </>
  )
}
