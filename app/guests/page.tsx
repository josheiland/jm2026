import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import GuestList from '@/components/GuestList'
import data from '@/data/guests.json'

export const metadata: Metadata = {
  title: 'Who’s Coming',
  description: 'Everyone coming, and how each of them knows us.',
}

/**
 * Seating is a surprise, so table numbers are stripped here rather than hidden in the
 * component. Anything handed to a client component ends up in the page source, and
 * "hidden" in the markup is not hidden from a guest who taps View Source.
 */
const strip = (g: { name: string; group: string }) => ({ name: g.name, group: g.group })

export default function GuestsPage() {
  const groups = data.groups.map((group) => ({
    label: group.label,
    blurb: group.blurb,
    members: group.members.map(strip),
  }))

  return (
    <>
      <PageHeader
        eyebrow={`${data.totalSeated} people`}
        title="Who’s Coming"
        lede="Every person on this list changed the shape of our lives somewhere along the way. Seeing you all in one place is a lot, and we recommend it."
      />

      <div className="content pb-20">
        <GuestList groups={groups} guests={data.guests.map(strip)} />
      </div>
    </>
  )
}
