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

type Pose = 'side' | 'threeQuarter' | 'front'
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

const BOWS: Record<Pose, { bow: string; knot: [number, number] }> = {
  side: { bow: 'M56 58 L47 54 C45 58 45 63 47 66 L56 61 Z M56 58 L65 54 C67 58 67 63 65 66 L56 61 Z', knot: [56, 59.5] },
  threeQuarter: { bow: 'M62 71 L53 66 C51 70 51 76 53 79 L62 74 Z M62 71 L71 66 C73 70 73 76 71 79 L62 74 Z', knot: [62, 72.5] },
  front: { bow: 'M60 75 L50 70 C48 74 48 80 50 83 L60 78 Z M60 75 L70 70 C72 74 72 80 70 83 L60 78 Z', knot: [60, 76.5] },
}

const BANDS: Record<Pose, string> = {
  side: 'M50 27 C58 19 72 20 78 28 C70 32 56 32 50 27 Z',
  threeQuarter: 'M46 25 C54 18 71 18 79 26 C70 30 54 30 46 25 Z',
  front: 'M43 24 C52 15 68 15 77 24 C68 29 52 29 43 24 Z',
}

const DOGS: Record<Pose, () => React.JSX.Element> = {
  side: Side,
  threeQuarter: ThreeQuarter,
  front: Front,
}
const VEILS: Record<Pose, () => React.JSX.Element> = {
  side: SideVeil,
  threeQuarter: ThreeQuarterVeil,
  front: FrontVeil,
}

export default function PupRealistic({ pose, role }: { pose: Pose; role: Role }) {
  const Dog = DOGS[pose]
  const VeilPanel = VEILS[pose]
  const bow = BOWS[pose]

  return (
    <svg viewBox="0 0 120 146" className="w-full h-full overflow-visible" aria-hidden="true">
      {role === 'bride' && <VeilPanel />}
      <Dog />
      {role === 'bride' && (
        <>
          <path className="pup-veil-fill" d={BANDS[pose]} />
          <path className="pup-veil-edge" d={BANDS[pose].replace(/ C[\d. ]+Z$/, '')} />
        </>
      )}
      {role === 'groom' && (
        <>
          <path className="pup-shape" d={bow.bow} />
          <ellipse className="pup-solid" cx={bow.knot[0]} cy={bow.knot[1]} rx={2} ry={2.5} />
        </>
      )}
    </svg>
  )
}

export type { Pose, Role }
