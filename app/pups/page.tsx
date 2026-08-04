import type { Metadata } from 'next'
import PupRealistic, { type Pose } from '@/components/PupRealistic'
import PupSilhouette, { type SilPose } from '@/components/PupSilhouette'

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
  {
    pose: 'puppyFront',
    name: 'Option 4 — puppy, front on',
    note: 'Actual puppy proportions: head close to half the height, stubby muzzle, big round eyes set low and wide, oversized paws. Flower circlet holding the veil, so the bride reads at a glance.',
  },
  {
    pose: 'puppyLoaf',
    name: 'Option 5 — puppy, chin on paws',
    note: 'Lying down with the chin resting over both front paws. The softest of the six and the only low, wide silhouette, so it sits differently in a corner.',
  },
  {
    pose: 'puppySide',
    name: 'Option 6 — puppy, side profile',
    note: 'The side profile again, but with puppy proportions this time: domed forehead, short snout, one big floppy ear. Head and muzzle are a single contour so the snout does not read as a separate blob.',
  },
]

const SILHOUETTES: { pose: SilPose; name: string; note: string }[] = [
  {
    pose: 'silStanding',
    name: 'Option 7 — standing silhouette',
    note: 'Solid fill, no interior line. Head carried forward so the ear hangs in clear air, and four legs with real gaps between them. The most legible of the silhouettes and the one I would defend.',
  },
  {
    pose: 'silSitting',
    name: 'Option 8 — sitting silhouette',
    note: 'Same treatment, sitting. Compact, but the body mass is doing a lot of work and the head reads heavy.',
  },
  {
    pose: 'silCameo',
    name: 'Option 9 — cameo',
    note: 'Head, neck and chest only, cropped on a hairline rule, the way a Victorian intaglio silhouette is. The most stationery-like of the six and the least fussy at small sizes.',
  },
  {
    pose: 'silMedallion',
    name: 'Option 10 — medallion',
    note: 'The sitting silhouette inside a double rule, like a wax seal or a monogram. Reads as a mark rather than a picture.',
  },
  {
    pose: 'silLookUp',
    name: 'Option 11 — looking up',
    note: 'Head raised, neck extended. The longest, softest line of the set, and it gives the veil more to hang from.',
  },
]

function SilPair({ pose, size, dark }: { pose: SilPose; size: number; dark?: boolean }) {
  return (
    <div
      className={`flex items-end gap-6 rounded px-6 py-5 ${
        dark ? 'bg-wine-deep pup pup-dark' : 'bg-cream pup'
      }`}
    >
      <div style={{ width: size, transform: 'scaleX(-1)' }}>
        <PupSilhouette pose={pose} role="bride" />
      </div>
      <div style={{ width: size }}>
        <PupSilhouette pose={pose} role="groom" />
      </div>
    </div>
  )
}

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
        Six realistic views, each as a pair: bride with the veil, groom with the bow tie. Shown at
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

      <section className="mt-20">
        <h2 className="display text-3xl">Silhouettes</h2>
        <p className="mt-3 max-w-2xl text-sm">
          Solid fill, no interior line. Read my note at the bottom before you pick from these five:
          I do not think they are all there yet, and there is a better way to get them there.
        </p>
        {SILHOUETTES.map((o) => (
          <div key={o.pose} className="mt-12">
            <h3 className="display text-2xl">{o.name}</h3>
            <p className="mt-2 max-w-2xl text-sm">{o.note}</p>
            <div className="mt-5 flex flex-wrap gap-5">
              <SilPair pose={o.pose} size={150} />
              <SilPair pose={o.pose} size={88} />
              <SilPair pose={o.pose} size={88} dark />
              <SilPair pose={o.pose} size={62} />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-20 max-w-2xl">
        <h2 className="display text-2xl">Where the silhouettes fall short</h2>
        <p className="mt-3 text-sm">
          A silhouette has no interior detail, so every error in the outline is the whole drawing.
          I am placing anatomy by typing coordinates, and after four passes options 8, 10 and 11 still
          read closer to a poodle or a lamb than to a puppy. Option 7 and option 9 hold up.
        </p>
        <p className="mt-3 text-sm">
          The better route: send me a photo of one of the fosters in profile and I will trace a true
          silhouette from it. The anatomy comes out right because it is a real dog, it is unmistakably
          yours rather than generic, and it is the same technique the elegant ones in this idiom use.
          A public-domain engraving would also work if you would rather not use a photo.
        </p>
      </section>

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
