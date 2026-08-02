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
        eyebrow={`${data.guestCount} guests · ${data.tableCount} tables`}
        title="Who’s Coming"
        lede="Every person in this list changed the shape of our lives somewhere along the way. Here they all are in one place, which we have never actually seen before and find quite moving."
      />

      <div className="content pb-20">
        <p className="mb-8 text-sm text-ink/50">
          A <span className="text-wine/60">◆</span> marks the {data.headTableCount} people at the
          head table — the wedding party, their significant others, and us.
        </p>

        <GuestList
          groups={data.groups}
          guests={data.guests}
          tableCount={data.tableCount}
        />

        <p className="mt-20 pt-8 border-t border-wine/10 text-sm text-ink/45 max-w-2xl">
          Seating comes straight from our planning sheet and may shift slightly before the day.
          Contact details are deliberately not published here. If we have your name wrong, or you
          are missing entirely, tell us — we would much rather fix it than have you find out at
          the table.
        </p>
      </div>
    </>
  )
}
