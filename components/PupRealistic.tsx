/**
 * Realistic line-art foster puppies, in three views. Drawn from anatomy rather
 * than from cartoon convention: real head-to-body ratio, a wedge muzzle with a
 * stop, drop ears, a proper topline and haunch, oversized puppy paws.
 *
 * Three things learned by rendering and looking:
 *  - An almond eye outline with a pupil inside reads as goggles at any size.
 *    A small solid almond with a paper catchlight reads as an eye.
 *  - The veil has to have a scalloped hem. Without it a translucent panel reads
 *    as a grey slab or a shadow. Fills survive downscaling; hairlines do not,
 *    which is why the first veil attempt dissolved below 80px.
 *  - A symmetric veil behind a front-on dog reads as an egg. It has to trail.
 */

type Pose = 'side' | 'threeQuarter' | 'front' | 'puppyFront' | 'puppyLoaf' | 'puppySide'
type Role = 'bride' | 'groom'

/** Shallow arcs along the hem — the signal that says tulle rather than paper. */
const scallop = (pts: [number, number][], sweep: 0 | 1) =>
  pts
    .slice(1)
    .map((b, i) => {
      const a = pts[i]
      const r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62
      return `A ${r} ${r} 0 0 ${sweep} ${b[0]} ${b[1]}`
    })
    .join(' ')

const Veil = ({
  attach,
  outer,
  hem,
  inner,
  folds,
  sweep,
}: {
  attach: string
  outer: string
  hem: [number, number][]
  inner: string
  folds: string[]
  sweep: 0 | 1
}) => (
  <>
    <path
      className="pup-veil-fill"
      d={`M${attach} C${outer} L${hem[0][0]} ${hem[0][1]} ${scallop(hem, sweep)} C${inner} Z`}
    />
    <path className="pup-veil-edge" d={`M${attach} C${outer}`} />
    <path className="pup-veil-edge" d={`M${hem[0][0]} ${hem[0][1]} ${scallop(hem, sweep)}`} />
    {folds.map((f) => (
      <path key={f} className="pup-veil-fold" d={`M${f}`} />
    ))}
  </>
)

const RoundEye = ({ x, y, r, flip }: { x: number; y: number; r: number; flip?: boolean }) => (
  <>
    <circle className="pup-solid" cx={x} cy={y} r={r} />
    <circle
      className="pup-catchlight"
      cx={x + (flip ? -r * 0.4 : r * 0.4)}
      cy={y - r * 0.4}
      r={r * 0.34}
    />
  </>
)

/** A circlet of flowers reads at 60px, where a bouquet in the mouth does not. */
const Circlet = ({ cx, cy, spread, tilt }: { cx: number; cy: number; spread: number; tilt: number }) => (
  <>
    <circle className="pup-shape" cx={cx - spread} cy={cy + tilt} r={3.4} />
    <circle className="pup-shape" cx={cx} cy={cy - 1.5} r={4} />
    <circle className="pup-shape" cx={cx + spread} cy={cy + tilt} r={3.4} />
  </>
)

const BowTie = ({ cx, cy, s }: { cx: number; cy: number; s: number }) => (
  <>
    <path
      className="pup-shape"
      d={`M${cx} ${cy} L${cx - s * 1.5} ${cy - s * 0.9} C${cx - s * 1.9} ${cy - s * 0.1} ${cx - s * 1.9} ${cy + s * 0.9} ${cx - s * 1.5} ${cy + s * 1.4} L${cx} ${cy + s * 0.55} Z
            M${cx} ${cy} L${cx + s * 1.5} ${cy - s * 0.9} C${cx + s * 1.9} ${cy - s * 0.1} ${cx + s * 1.9} ${cy + s * 0.9} ${cx + s * 1.5} ${cy + s * 1.4} L${cx} ${cy + s * 0.55} Z`}
    />
    <ellipse className="pup-solid" cx={cx} cy={cy + s * 0.28} rx={s * 0.4} ry={s * 0.5} />
  </>
)

const Eye = ({ x, y, r, flip }: { x: number; y: number; r: number; flip?: boolean }) => (
  <>
    <path
      className="pup-solid"
      d={`M${x - r * 1.6} ${y} C${x - r} ${y - r * 1.45} ${x + r} ${y - r * 1.45} ${x + r * 1.6} ${y}
          C${x + r} ${y + r * 1.3} ${x - r} ${y + r * 1.3} ${x - r * 1.6} ${y} Z`}
    />
    <circle
      className="pup-catchlight"
      cx={x + (flip ? -r * 0.45 : r * 0.45)}
      cy={y - r * 0.35}
      r={r * 0.3}
    />
  </>
)

/* -- side profile, sitting, facing left ---------------------------------- */
const Side = () => (
  <>
    <path className="pup-line" d="M96 96 C107 90 111 76 105 66" />
    <path
      className="pup-shape"
      d="M72 82 C88 82 98 96 96 112 C94 126 84 133 72 132 C60 131 54 122 55 108 C56 94 62 82 72 82 Z"
    />
    <path
      className="pup-shape"
      d="M58 126 C50 127 45 130 46 134 C47 137 56 137 63 135 C68 133 68 127 58 126 Z"
    />
    <path
      className="pup-shape"
      d="M50 68 C40 74 36 90 38 106 C40 120 48 128 58 128 C70 128 76 118 76 104 C76 86 66 70 56 66 Z"
    />
    <path className="pup-line" d="M45 100 C43 112 43 124 44 132" />
    <path className="pup-shape" d="M37 132 C34 136 37 139 44 139 C51 139 53 136 50 132 Z" />
    <path className="pup-detail" d="M40 136 L40 139 M44 135.5 L44 139" />
    <path className="pup-shape" d="M52 62 C48 54 46 46 48 40 L64 44 C64 52 60 62 56 66 Z" />
    <path
      className="pup-shape"
      d="M46 34 C46 24 54 18 62 19 C70 20 75 27 74 36 C73 43 70 48 64 50 C58 52 50 50 47 44 C45 40 46 37 46 34 Z"
    />
    <path
      className="pup-shape"
      d="M46 36 C38 36 30 40 25 45 C22 48 22 52 26 54 C31 56 38 55 43 52 C47 49 48 41 46 36 Z"
    />
    <path className="pup-shape" d="M62 28 C70 26 78 34 78 46 C78 56 72 60 67 56 C63 53 61 40 62 32 Z" />
    <Eye x={43} y={41} r={2.4} flip />
    <path className="pup-solid" d="M25 45 C22 45 20 47 21 50 C22 52 25 53 27 51 C29 49 28 45 25 45 Z" />
    <path className="pup-detail" d="M23 52 C27 55 33 56 38 54" />
  </>
)
const SideVeil = () => (
  <Veil
    attach="66 24"
    outer="84 30 98 54 100 84"
    hem={[
      [100, 84],
      [97, 93],
      [91, 99],
      [83, 102],
      [74, 102],
    ]}
    inner="70 84 64 44 66 24"
    folds={['78 32 C90 52 94 74 92 94', '62 28 C72 50 76 74 72 96']}
    sweep={0}
  />
)

/* -- sitting three-quarter ----------------------------------------------- */
const ThreeQuarter = () => (
  <>
    <path
      className="pup-shape"
      d="M74 92 C86 96 92 110 88 122 C85 131 74 134 66 130 C60 127 58 118 60 108 Z"
    />
    <path
      className="pup-shape"
      d="M56 74 C47 84 43 100 45 114 C47 126 57 132 68 131 C78 130 84 122 84 110 C84 96 76 80 68 73 Z"
    />
    <path
      className="pup-shape"
      d="M44 98 C32 101 26 114 30 125 C33 133 45 136 52 130 C58 125 58 110 54 101 Z"
    />
    <path className="pup-line" d="M57 116 C56 123 56 129 57 133" />
    <path className="pup-shape" d="M50 133 C48 137 51 139 57 139 C63 139 65 137 63 133 Z" />
    <path className="pup-line" d="M72 114 C72 122 72 128 72 133" />
    <path className="pup-shape" d="M66 133 C64 137 67 139 73 139 C79 139 81 137 79 133 Z" />
    <path className="pup-line" d="M30 112 C19 108 15 94 23 85" />
    <path className="pup-detail" d="M56 89 C59 93 58 98 55 101" />
    <path className="pup-shape" d="M47 31 C36 30 29 42 31 56 C32 66 40 71 46 66 C50 62 49 48 48 41 Z" />
    <path className="pup-shape" d="M79 30 C89 32 94 44 91 55 C89 63 82 66 78 61 C75 57 76 43 78 35 Z" />
    <path
      className="pup-shape"
      d="M44 40 C44 26 52 18 62 18 C72 18 80 26 80 40 C80 53 72 63 62 63 C52 63 44 53 44 40 Z"
    />
    <path
      className="pup-shape"
      d="M55 51 C51 58 52 69 58 74 C63 78 71 78 75 73 C79 68 78 60 74 55 C69 49 59 47 55 51 Z"
    />
    <Eye x={54} y={41} r={2.3} />
    <Eye x={71.5} y={40} r={2.1} flip />
    <path className="pup-solid" d="M64 58 C67 56 71 57 72 60 C72 63 68 64 65 63 C63 62 62 59 64 58 Z" />
    <path className="pup-detail" d="M67 63 L67 67 M67 67 C64 70 61 70 59 67 M67 67 C70 70 73 70 75 67" />
  </>
)
const ThreeQuarterVeil = () => (
  <Veil
    attach="50 25"
    outer="34 30 22 52 20 78"
    hem={[
      [20, 78],
      [26, 86],
      [34, 91],
      [43, 93],
      [52, 92],
    ]}
    inner="48 76 46 44 50 25"
    folds={['40 34 C30 50 27 68 29 84', '56 30 C48 48 46 66 49 84']}
    sweep={1}
  />
)

/* -- sitting front-on ---------------------------------------------------- */
const Front = () => (
  <>
    <path
      className="pup-shape"
      d="M60 74 C48 80 40 98 42 116 C44 130 52 136 60 136 C68 136 76 130 78 116 C80 98 72 80 60 74 Z"
    />
    <path className="pup-shape" d="M40 108 C30 112 26 124 31 132 C35 138 46 138 52 132 Z" />
    <path className="pup-shape" d="M80 108 C90 112 94 124 89 132 C85 138 74 138 68 132 Z" />
    <path className="pup-shape" d="M50 131 C46 135 48 139 55 139 C61 139 63 136 61 131 Z" />
    <path className="pup-shape" d="M70 131 C66 135 68 139 75 139 C81 139 83 136 81 131 Z" />
    <path className="pup-shape" d="M42 28 C30 28 24 42 27 57 C29 68 38 72 44 66 C48 61 45 40 43 32 Z" />
    <path className="pup-shape" d="M78 28 C90 28 96 42 93 57 C91 68 82 72 76 66 C72 61 75 40 77 32 Z" />
    <path
      className="pup-shape"
      d="M40 40 C40 25 49 16 60 16 C71 16 80 25 80 40 C80 56 72 68 60 68 C48 68 40 56 40 40 Z"
    />
    <path
      className="pup-shape"
      d="M52 50 C48 56 47 66 52 71 C57 75 63 75 68 71 C73 66 72 56 68 50 C64 45 56 45 52 50 Z"
    />
    <Eye x={51} y={40} r={2.4} />
    <Eye x={69} y={40} r={2.4} flip />
    <path className="pup-solid" d="M56 56 C58 54 62 54 64 56 C65 59 62 61 60 61 C58 61 55 59 56 56 Z" />
    <path className="pup-detail" d="M60 61 L60 65 M60 65 C57 69 53 68 51 65 M60 65 C63 69 67 68 69 65" />
  </>
)
const FrontVeil = () => (
  <Veil
    attach="46 23"
    outer="28 28 14 52 13 80"
    hem={[
      [13, 80],
      [19, 89],
      [27, 95],
      [37, 98],
      [47, 97],
    ]}
    inner="44 78 42 42 46 23"
    folds={['34 32 C24 50 20 70 22 88', '52 28 C44 48 42 68 45 88']}
    sweep={1}
  />
)


/* == puppy proportions: head near 45% of the drawing, stubby muzzle, round ==
   == eyes set low and wide, oversized paws, short thick legs.            == */

/* -- 4: front-on puppy --------------------------------------------------- */
const PuppyFront = () => (
  <>
    <path className="pup-shape" d="M40 26 C23 26 13 45 17 65 C20 79 34 83 42 75 C47 69 44 40 42 30 Z" />
    <path className="pup-shape" d="M80 26 C97 26 107 45 103 65 C100 79 86 83 78 75 C73 69 76 40 78 30 Z" />
    <path className="pup-shape" d="M60 66 C50 72 44 88 45 102 C46 114 52 121 60 121 C68 121 74 114 75 102 C76 88 70 72 60 66 Z" />
    <path className="pup-shape" d="M46 96 C37 99 33 110 38 118 C42 123 51 122 55 117 Z" />
    <path className="pup-shape" d="M74 96 C83 99 87 110 82 118 C78 123 69 122 65 117 Z" />
    <path className="pup-shape" d="M50 114 C43 115 39 120 41 125 C43 129 54 129 58 125 C61 122 58 114 50 114 Z" />
    <path className="pup-shape" d="M70 114 C77 115 81 120 79 125 C77 129 66 129 62 125 C59 122 62 114 70 114 Z" />
    <path className="pup-detail" d="M46 122 L46 127 M51 121 L51 128 M69 121 L69 128 M74 122 L74 127" />
    <path className="pup-shape" d="M34 40 C34 23 45 13 60 13 C75 13 86 23 86 40 C86 58 75 68 60 68 C45 68 34 58 34 40 Z" />
    <path className="pup-shape" d="M49 53 C44 57 44 66 49 70 C54 74 66 74 71 70 C76 66 76 57 71 53 C66 49 54 49 49 53 Z" />
    <RoundEye x={48} y={43} r={4.1} />
    <RoundEye x={72} y={43} r={4.1} flip />
    <path className="pup-solid" d="M55 56 C57 53 63 53 65 56 C66 60 63 62 60 62 C57 62 54 60 55 56 Z" />
    <path className="pup-detail" d="M60 62 L60 66 M60 66 C57 69 54 69 52 66 M60 66 C63 69 66 69 68 66" />
  </>
)
const PuppyFrontVeil = () => (
  <Veil attach="44 20" outer="24 26 10 52 9 82"
    hem={[[9, 82], [15, 92], [24, 99], [35, 102], [46, 101]]}
    inner="42 80 40 40 44 20"
    folds={['32 30 C21 50 17 72 19 92', '52 24 C43 46 40 70 43 94']} sweep={1} />
)

/* -- 5: lying down, chin over the paws ---------------------------------- */
const PuppyLoaf = () => (
  <>
    <path className="pup-shape" d="M34 82 C22 84 16 96 21 105 C28 113 100 113 107 105 C112 96 106 84 94 81 C86 79 74 78 64 78 C52 78 42 80 34 82 Z" />
    <path className="pup-shape" d="M92 80 C103 80 110 90 108 99 C106 107 96 109 90 104 C86 100 86 84 92 80 Z" />
    <path className="pup-shape" d="M47 92 C40 93 36 99 38 104 C40 109 53 109 58 105 C61 101 57 92 47 92 Z" />
    <path className="pup-shape" d="M74 92 C81 93 85 99 83 104 C81 109 68 109 63 105 C60 101 64 92 74 92 Z" />
    <path className="pup-detail" d="M44 100 L44 107 M50 99 L50 108 M71 99 L71 108 M77 100 L77 107" />
    <path className="pup-shape" d="M44 26 C28 26 18 44 22 63 C25 76 38 80 46 72 C51 66 47 40 46 30 Z" />
    <path className="pup-shape" d="M86 26 C102 26 112 44 108 63 C105 76 92 80 84 72 C79 66 83 40 84 30 Z" />
    <path className="pup-shape" d="M39 40 C39 24 50 14 65 14 C80 14 91 24 91 40 C91 57 80 67 65 67 C50 67 39 57 39 40 Z" />
    <path className="pup-shape" d="M54 52 C49 56 49 65 54 69 C59 73 71 73 76 69 C81 65 81 56 76 52 C71 48 59 48 54 52 Z" />
    <RoundEye x={53} y={42} r={4.1} />
    <RoundEye x={77} y={42} r={4.1} flip />
    <path className="pup-solid" d="M60 55 C62 52 68 52 70 55 C71 59 68 61 65 61 C62 61 59 59 60 55 Z" />
    <path className="pup-detail" d="M65 61 L65 65 M65 65 C62 68 59 68 57 65 M65 65 C68 68 71 68 73 65" />
  </>
)
const PuppyLoafVeil = () => (
  <Veil attach="49 21" outer="29 27 14 50 14 78"
    hem={[[14, 78], [19, 89], [27, 97], [38, 101], [49, 100]]}
    inner="47 78 45 40 49 21"
    folds={['37 30 C26 48 22 68 24 90', '57 25 C48 44 45 66 48 92']} sweep={1} />
)

/* -- 6: side profile puppy, facing left ---------------------------------- */
const PuppySide = () => (
  <>
    <path className="pup-line" d="M86 92 C97 86 100 74 94 67" />
    <path className="pup-shape" d="M64 76 C82 76 92 92 90 108 C88 121 78 127 65 126 C54 125 49 114 50 101 C51 86 56 76 64 76 Z" />
    <path className="pup-shape" d="M44 58 C34 66 30 84 32 100 C34 114 42 122 52 122 C64 122 70 112 70 98 C70 80 56 62 50 56 Z" />
    <path className="pup-shape" d="M50 119 C41 120 36 124 37 128 C38 132 49 132 56 130 C61 128 61 120 50 119 Z" />
    <path className="pup-line" d="M38 94 C36 105 36 117 37 125" />
    <path className="pup-shape" d="M29 125 C25 129 29 133 38 133 C47 133 49 129 45 125 Z" />
    <path className="pup-detail" d="M32 129 L32 133 M38 128 L38 133" />
    {/* head and muzzle as one contour: dome, a dip for the stop, short snout */}
    <path className="pup-shape" d="M14 46 C16 40 22 37 28 36 C32 26 40 18 52 18 C66 18 76 26 76 40 C76 50 70 58 60 60 C50 62 38 60 30 56 C22 54 15 52 14 46 Z" />
    <path className="pup-shape" d="M60 26 C71 25 78 38 76 53 C74 64 66 68 62 62 C58 57 58 37 60 28 Z" />
    <RoundEye x={34} y={38} r={3.7} flip />
    <path className="pup-solid" d="M16 45 C13 44 11 46 11 49 C11 52 15 54 18 52 C20 50 19 46 16 45 Z" />
    <path className="pup-detail" d="M15 53 C20 57 27 58 32 56" />
  </>
)
const PuppySideVeil = () => (
  <Veil attach="58 20" outer="80 24 94 50 96 82"
    hem={[[96, 82], [93, 92], [87, 99], [78, 102], [69, 101]]}
    inner="65 82 56 40 58 20"
    folds={['73 28 C85 48 89 72 87 92', '54 24 C66 46 70 72 66 94']} sweep={0} />
)

const ADULT: Record<'side' | 'threeQuarter' | 'front', { bow: string; knot: [number, number]; band: string }> = {
  side: {
    bow: 'M56 58 L47 54 C45 58 45 63 47 66 L56 61 Z M56 58 L65 54 C67 58 67 63 65 66 L56 61 Z',
    knot: [56, 59.5],
    band: 'M50 27 C58 19 72 20 78 28 C70 32 56 32 50 27 Z',
  },
  threeQuarter: {
    bow: 'M62 71 L53 66 C51 70 51 76 53 79 L62 74 Z M62 71 L71 66 C73 70 73 76 71 79 L62 74 Z',
    knot: [62, 72.5],
    band: 'M46 25 C54 18 71 18 79 26 C70 30 54 30 46 25 Z',
  },
  front: {
    bow: 'M60 75 L50 70 C48 74 48 80 50 83 L60 78 Z M60 75 L70 70 C72 74 72 80 70 83 L60 78 Z',
    knot: [60, 76.5],
    band: 'M43 24 C52 15 68 15 77 24 C68 29 52 29 43 24 Z',
  },
}

const PUPPY: Record<
  'puppyFront' | 'puppyLoaf' | 'puppySide',
  { circlet: [number, number, number, number]; bow: [number, number, number] }
> = {
  puppyFront: { circlet: [60, 16, 13, 3], bow: [60, 74, 5.5] },
  puppyLoaf: { circlet: [65, 17, 13, 3], bow: [65, 74, 5] },
  puppySide: { circlet: [50, 17, 13, 3], bow: [45, 60, 5.2] },
}

const SPEC: Record<Pose, { viewBox: string; Dog: () => React.JSX.Element; VeilPanel: () => React.JSX.Element }> = {
  side: { viewBox: '0 0 120 146', Dog: Side, VeilPanel: SideVeil },
  threeQuarter: { viewBox: '0 0 120 146', Dog: ThreeQuarter, VeilPanel: ThreeQuarterVeil },
  front: { viewBox: '0 0 120 146', Dog: Front, VeilPanel: FrontVeil },
  puppyFront: { viewBox: '0 0 120 134', Dog: PuppyFront, VeilPanel: PuppyFrontVeil },
  puppyLoaf: { viewBox: '0 0 130 120', Dog: PuppyLoaf, VeilPanel: PuppyLoafVeil },
  puppySide: { viewBox: '0 0 110 140', Dog: PuppySide, VeilPanel: PuppySideVeil },
}

const isPuppy = (p: Pose): p is 'puppyFront' | 'puppyLoaf' | 'puppySide' => p in PUPPY

export default function PupRealistic({ pose, role }: { pose: Pose; role: Role }) {
  const { viewBox, Dog, VeilPanel } = SPEC[pose]

  return (
    <svg viewBox={viewBox} className="w-full h-full overflow-visible" aria-hidden="true">
      {role === 'bride' && <VeilPanel />}
      <Dog />
      {role === 'bride' &&
        (isPuppy(pose) ? (
          <Circlet
            cx={PUPPY[pose].circlet[0]}
            cy={PUPPY[pose].circlet[1]}
            spread={PUPPY[pose].circlet[2]}
            tilt={PUPPY[pose].circlet[3]}
          />
        ) : (
          <>
            <path className="pup-veil-fill" d={ADULT[pose].band} />
            <path className="pup-veil-edge" d={ADULT[pose].band.replace(/ C[\d. ]+Z$/, '')} />
          </>
        ))}
      {role === 'groom' &&
        (isPuppy(pose) ? (
          <BowTie cx={PUPPY[pose].bow[0]} cy={PUPPY[pose].bow[1]} s={PUPPY[pose].bow[2]} />
        ) : (
          <>
            <path className="pup-shape" d={ADULT[pose].bow} />
            <ellipse
              className="pup-solid"
              cx={ADULT[pose].knot[0]}
              cy={ADULT[pose].knot[1]}
              rx={2}
              ry={2.5}
            />
          </>
        ))}
    </svg>
  )
}

export type { Pose, Role }
