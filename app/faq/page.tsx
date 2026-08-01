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
        lede="Everything we have been asked more than twice. If yours is not here, the group chat is faster than email and we do actually read it."
      />

      <div className="content pb-20">
        <FaqAccordion faqs={FAQS} />

        <div className="mt-20 card p-8 md:p-10 text-center">
          <p className="display text-2xl">Still wondering something?</p>
          <p className="mt-3 text-ink/65 max-w-md mx-auto">
            Genuinely, ask. There is no question too small — several people have already asked
            about parking and we were glad they did.
          </p>
          <div className="mt-6 flex justify-center">
            <WhatsAppButton />
          </div>
        </div>
      </div>
    </>
  )
}
