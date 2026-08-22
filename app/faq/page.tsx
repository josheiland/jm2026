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

        <div className="mt-20 card p-8 md:p-10 text-center">
          <p className="display text-2xl">Still wondering something?</p>
          <p className="mt-3 text-ink/65 max-w-md mx-auto">
            Ask. We’ve answered stranger things.
          </p>
          <div className="mt-6 flex justify-center">
            <WhatsAppButton />
          </div>
        </div>
      </div>
    </>
  )
}
