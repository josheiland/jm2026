import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import GuestList from '@/components/GuestList'
import data from '@/data/guests.json'

export const metadata: Metadata = {
  title: 'Who’s Coming',
  description: 'Everyone coming, and how each of them knows us.',
}

export default function GuestsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${data.totalSeated} people`}
        title="Who’s Coming"
        lede="Every person on this list changed the shape of our lives somewhere along the way. Seeing you all in one place is a lot, and we recommend it."
      />

      <div className="content pb-20">
        <GuestList groups={data.groups} guests={data.guests} tableCount={data.tableCount} />
      </div>
    </>
  )
}
