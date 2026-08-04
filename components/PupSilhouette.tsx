/**
 * Solid-silhouette treatments. Built from anatomical masses that union into one
 * shape rather than from a single hand-authored contour, because each mass can
 * then be placed on its own.
 *
 * Two failures worth recording, both found by rendering and looking:
 *  - Every early attempt read as a bird, because the muzzle came to a POINT. A
 *    dog's muzzle is blunt: it needs real depth at the nose end.
 *  - The ear kept vanishing. In strict profile a sitting dog's ear falls against
 *    its own neck, so there is no background behind it. The head is raised and
 *    the ear swings forward to hang in clear air instead.
 *
 * Silhouettes are unforgiving: with no interior detail, every contour error is
 * the whole drawing. See the note on /pups about where these still fall short.
 */

type SilPose = 'silSitting' | 'silStanding' | 'silCameo' | 'silMedallion' | 'silLookUp'
type Role = 'bride' | 'groom'

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
  sweep,
}: {
  attach: string
  outer: string
  hem: [number, number][]
  inner: string
  sweep: 0 | 1
}) => (
  <>
    <path
      className="pup-sil-veil"
      d={`M${attach} C${outer} L${hem[0][0]} ${hem[0][1]} ${scallop(hem, sweep)} C${inner} Z`}
    />
    <path className="pup-sil-veil-edge" d={`M${attach} C${outer}`} />
    <path className="pup-sil-veil-edge" d={`M${hem[0][0]} ${hem[0][1]} ${scallop(hem, sweep)}`} />
  </>
)

/** The bow tie is cut out of the mass in paper colour; drawn in ink it vanishes. */
const Bow = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <path
    className="pup-sil-cut"
    d={`M${x} ${y} L${x - s * 1.5} ${y - s * 0.85} C${x - s * 1.9} ${y} ${x - s * 1.9} ${y + s * 0.9} ${x - s * 1.5} ${y + s * 1.4} L${x} ${y + s * 0.5} Z
        M${x} ${y} L${x + s * 1.5} ${y - s * 0.85} C${x + s * 1.9} ${y} ${x + s * 1.9} ${y + s * 0.9} ${x + s * 1.5} ${y + s * 1.4} L${x} ${y + s * 0.5} Z`}
  />
)

const Sitting = () => (
  <g className="pup-sil-fill">
    <path d="M46 72 C40 82 38 96 40 108 C42 116 50 120 60 120 C72 120 84 118 92 112 C100 106 102 92 98 80 C94 70 84 64 74 64 C62 64 52 66 46 72 Z" />
    <path d="M96 78 C106 72 112 60 110 50 C114 60 108 78 100 86 Z" />
    <ellipse cx="62" cy="117" rx="12" ry="4.5" />
    <path d="M44 84 L54 84 C54 96 53 108 53 116 L43 116 C43 106 43 94 44 84 Z" />
    <ellipse cx="47" cy="116" rx="9" ry="4" />
    <ellipse cx="54" cy="54" rx="9" ry="15" transform="rotate(12 54 54)" />
    <ellipse cx="42" cy="32" rx="15" ry="14" />
    <ellipse cx="26" cy="42" rx="11" ry="6.5" />
    <circle cx="17" cy="41" r="3.6" />
    <ellipse cx="34" cy="54" rx="8.5" ry="15" transform="rotate(-20 34 54)" />
  </g>
)

const Standing = () => (
  <g className="pup-sil-fill">
    <path d="M56 46 C60 34 72 30 88 30 C102 30 112 34 118 42 C123 50 122 58 118 62 C112 64 104 64 96 63 C86 68 74 72 66 72 C59 71 55 60 56 50 Z" />
    <path d="M116 36 C124 28 130 16 128 8 C132 18 126 34 120 45 Z" />
    <path d="M60 66 C57 76 56 86 56 94 L66 94 C66 86 66 76 68 66 Z" />
    <ellipse cx="61" cy="95" rx="8" ry="3.6" />
    <path d="M74 68 C72 78 72 86 72 94 L80 94 C80 86 80 78 81 68 Z" />
    <ellipse cx="76" cy="95" rx="7" ry="3.2" />
    <path d="M92 62 C98 66 100 74 97 82 C95 87 94 89 95 94 L101 94 C103 87 104 80 104 72 C104 65 99 60 92 62 Z" />
    <ellipse cx="98" cy="95" rx="7" ry="3.2" />
    <path d="M100 60 C108 64 110 74 106 82 C104 88 102 90 104 94 L112 94 C114 86 116 78 116 70 C116 62 110 56 100 60 Z" />
    <ellipse cx="108" cy="95" rx="8" ry="3.6" />
    <ellipse cx="50" cy="36" rx="14" ry="9" transform="rotate(28 50 36)" />
    <ellipse cx="34" cy="27" rx="15" ry="14" />
    <ellipse cx="18" cy="36" rx="11" ry="6.5" />
    <circle cx="9" cy="35" r="3.6" />
    <ellipse cx="26" cy="44" rx="8" ry="14" transform="rotate(-14 26 44)" />
  </g>
)

const LookUp = () => (
  <g className="pup-sil-fill">
    <path d="M46 76 C40 86 38 98 40 108 C42 116 50 120 60 120 C72 120 84 118 92 112 C100 106 102 92 98 80 C94 70 84 66 74 66 C62 66 52 70 46 76 Z" />
    <path d="M96 80 C106 74 112 62 110 52 C114 62 108 80 100 88 Z" />
    <ellipse cx="62" cy="117" rx="12" ry="4.5" />
    <path d="M46 86 L56 86 C56 98 55 108 55 116 L45 116 C45 106 45 96 46 86 Z" />
    <ellipse cx="49" cy="116" rx="9" ry="4" />
    <ellipse cx="56" cy="54" rx="9" ry="17" transform="rotate(20 56 54)" />
    <ellipse cx="46" cy="28" rx="15" ry="13.5" transform="rotate(-16 46 28)" />
    <ellipse cx="29" cy="31" rx="11" ry="6.5" transform="rotate(-20 29 31)" />
    <circle cx="20" cy="28" r="3.6" />
    <ellipse cx="42" cy="50" rx="8" ry="14" transform="rotate(-26 42 50)" />
  </g>
)

const SITTING_VEIL = {
  attach: '48 18',
  outer: '66 22 82 46 82 76',
  hem: [
    [82, 76],
    [79, 86],
    [73, 93],
    [64, 96],
    [54, 95],
  ] as [number, number][],
  inner: '52 76 46 32 48 18',
  sweep: 0 as const,
}
const STANDING_VEIL = {
  attach: '40 13',
  outer: '58 17 74 40 74 70',
  hem: [
    [74, 70],
    [71, 80],
    [65, 87],
    [56, 90],
    [46, 89],
  ] as [number, number][],
  inner: '44 70 38 27 40 13',
  sweep: 0 as const,
}
const LOOKUP_VEIL = {
  attach: '52 15',
  outer: '70 20 86 44 86 74',
  hem: [
    [86, 74],
    [83, 84],
    [77, 91],
    [68, 94],
    [58, 93],
  ] as [number, number][],
  inner: '56 74 50 30 52 15',
  sweep: 0 as const,
}

export default function PupSilhouette({ pose, role }: { pose: SilPose; role: Role }) {
  const bride = role === 'bride'

  if (pose === 'silStanding') {
    return (
      <svg viewBox="0 0 134 102" className="w-full h-full overflow-visible" aria-hidden="true">
        {bride && <Veil {...STANDING_VEIL} />}
        <Standing />
        <ellipse className="pup-sil-cut" cx="28" cy="27" rx="2.2" ry="1.8" />
        {!bride && <Bow x={44} y={46} s={4.8} />}
      </svg>
    )
  }

  if (pose === 'silLookUp') {
    return (
      <svg viewBox="0 0 118 126" className="w-full h-full overflow-visible" aria-hidden="true">
        {bride && <Veil {...LOOKUP_VEIL} />}
        <LookUp />
        <ellipse className="pup-sil-cut" cx="40" cy="26" rx="2.3" ry="1.9" />
        {!bride && <Bow x={54} y={72} s={5} />}
      </svg>
    )
  }

  if (pose === 'silCameo') {
    // Head, neck and chest only, cropped on a hairline rule like an intaglio.
    return (
      <svg viewBox="0 0 96 92" className="w-full h-full overflow-visible" aria-hidden="true">
        <g transform="translate(-6,-16)">
          {bride && <Veil {...SITTING_VEIL} />}
          <Sitting />
        </g>
        <ellipse className="pup-sil-cut" cx="30" cy="16" rx="2.3" ry="1.9" />
        {!bride && <Bow x={44} y={54} s={5} />}
        <rect className="pup-sil-cut" x="-12" y="78" width="124" height="32" />
        <path className="pup-sil-rule" d="M2 78 L94 78" />
      </svg>
    )
  }

  if (pose === 'silMedallion') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible" aria-hidden="true">
        <circle className="pup-sil-rule" cx="60" cy="60" r="55" />
        <circle className="pup-sil-rule" cx="60" cy="60" r="50" strokeWidth={0.6} />
        <g transform="translate(16,6) scale(0.72)">
          {bride && <Veil {...SITTING_VEIL} />}
          <Sitting />
          <ellipse className="pup-sil-cut" cx="36" cy="32" rx="2.3" ry="1.9" />
          {!bride && <Bow x={50} y={70} s={5} />}
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 118 126" className="w-full h-full overflow-visible" aria-hidden="true">
      {bride && <Veil {...SITTING_VEIL} />}
      <Sitting />
      <ellipse className="pup-sil-cut" cx="36" cy="32" rx="2.3" ry="1.9" />
      {!bride && <Bow x={50} y={70} s={5} />}
    </svg>
  )
}

export type { SilPose }
