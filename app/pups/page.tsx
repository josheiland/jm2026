import type { Metadata } from 'next'
import PupRealistic, { type Pose } from '@/components/PupRealistic'

/**
 * Temporary picker so Josh can compare the realistic puppy views where they will
 * actually live: two sizes, both backgrounds. Delete this route once a pose wins.
 */
export const metadata: Metadata = {
  title: 'Puppy options',
  robots: { index: false, follow: false },
}

const OPTIONS: { pose: Pose; name: string; note: string }[] = [
  {
    pose: 'side',
    name: 'Option 1 — side profile',
    note: 'Sitting, seen from the side. The most dog-like of the three: you read the topline, the haunch and the wedge of the muzzle straight away. Veil trails behind.',
  },
  {
    pose: 'threeQuarter',
    name: 'Option 2 — three-quarter',
    note: 'Sitting, turned toward you. Keeps the profile of the muzzle but you still get both eyes, so it has more face than Option 1.',
  },
  {
    pose: 'front',
    name: 'Option 3 — front on',
    note: 'Sitting, facing you. Symmetrical and the most portrait-like. Cleanest at small sizes, least anatomy on show.',
  },
]

function Pair({ pose, size, dark }: { pose: Pose; size: number; dark?: boolean }) {
  return (
    <div
      className={`flex items-end gap-6 rounded px-6 py-5 ${
        dark ? 'bg-wine-deep pup pup-dark pup-real' : 'bg-cream pup pup-real'
      }`}
    >
      <div style={{ width: size, transform: 'scaleX(-1)' }}>
        <PupRealistic pose={pose} role="bride" />
      </div>
      <div style={{ width: size }}>
        <PupRealistic pose={pose} role="groom" />
      </div>
    </div>
  )
}

export default function PupsPage() {
  return (
    <div className="content py-16">
      <h1 className="display text-4xl">Puppy options</h1>
      <p className="mt-4 max-w-2xl">
        Three realistic views, each as a pair: bride with the veil, groom with the bow tie. Shown at
        the size they run in the corners on a laptop, then at phone size, on both backgrounds. Tell
        me a number and I will wire it in and rebuild the movements to match.
      </p>

      {OPTIONS.map((o) => (
        <section key={o.pose} className="mt-14">
          <h2 className="display text-2xl">{o.name}</h2>
          <p className="mt-2 max-w-2xl text-sm">{o.note}</p>
          <div className="mt-5 flex flex-wrap gap-5">
            <Pair pose={o.pose} size={88} />
            <Pair pose={o.pose} size={88} dark />
            <Pair pose={o.pose} size={64} />
            <Pair pose={o.pose} size={64} dark />
          </div>
        </section>
      ))}

      <section className="mt-16">
        <h2 className="display text-2xl">Big, for judging the drawing</h2>
        <div className="mt-5 flex flex-wrap gap-5">
          {OPTIONS.map((o) => (
            <Pair key={o.pose} pose={o.pose} size={150} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          {OPTIONS.map((o) => (
            <Pair key={o.pose} pose={o.pose} size={150} dark />
          ))}
        </div>
      </section>
    </div>
  )
}
