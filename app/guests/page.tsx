import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import GuestList from '@/components/GuestList'
import data from '@/data/guests.json'

export const metadata: Metadata = {
  title: 'Who’s Coming',
  description: 'All 151 guests, and how each of them knows us.',
}

export default function GuestsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${data.totalSeated} people · ${data.tableCount} tables`}
        title="Who’s Coming"
        lede="Every person in this list changed the shape of our lives somewhere along the way. Here they all are in one place, which we have never actually seen before and find quite moving."
      />

      <div className="content pb-20">
        <GuestList
          groups={data.groups}
          guests={data.guests}
          tableCount={data.tableCount}
        />

        <p className="mt-20 pt-8 border-t border-wine/10 text-sm text-ink/45 max-w-2xl">
          Seating is drawn from our chart as of August 1 and may shift slightly before the day.
          Contact details are deliberately not published here.
        </p>
      </div>
    </>
  )
}
