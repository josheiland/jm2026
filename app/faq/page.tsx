import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import FaqAccordion from '@/components/FaqAccordion'
import WhatsAppButton from '@/components/WhatsAppButton'
import { FAQS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'The questions people keep asking, answered.',
}

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ask us anything"
        title="FAQs"
        lede="Everything we have been asked more than twice. If yours is not here, the WhatsApp is faster than email and we do actually read it."
      />
      {/* Dress code, food and shuttle answers all live here rather than on a separate
          travel page, which was cut on the Aug 1 review as one tab too many. */}

      <div className="content pb-20">
        <FaqAccordion faqs={FAQS} />

        <div className="mt-12 border border-wine/20 px-5 py-5 text-center md:px-8">
          <p className="display text-[27px]">Still wondering something?</p>
          <p className="mx-auto mt-2 max-w-md text-[18px] text-ink/70">
            Ask. No question is too small.
          </p>
          <div className="mt-5 flex justify-center">
            <WhatsAppButton />
          </div>
        </div>
      </div>
    </>
  )
}
