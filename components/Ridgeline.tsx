/**
 * The Blue Ridge, abstracted. Hazy Mountain sits in the foothills just west of
 * Charlottesville and the layered-haze silhouette is the single most recognisable
 * thing about the view from the vineyard — it does the work a hero photo would.
 *
 * One silhouette, used two ways. `RidgeEdge` is the same three layers filled in a
 * single colour and hung off the edge of a block: wine-deep above the "Up next"
 * band, cream below the dark page headers. Same range either way, which is the
 * whole reason it can carry the app on its own.
 */

const LAYERS: [string, number][] = [
  [
    'M0 120 V78 L120 58 L245 74 L390 40 L520 66 L640 34 L780 62 L900 44 L1040 70 L1180 48 L1310 68 L1440 52 V120 Z',
    0.2,
  ],
  [
    'M0 120 V92 L140 74 L280 90 L420 62 L560 84 L700 58 L840 82 L980 66 L1120 88 L1270 70 L1440 86 V120 Z',
    0.45,
  ],
  [
    'M0 120 V104 L160 92 L320 104 L470 86 L620 102 L770 88 L920 104 L1080 92 L1240 106 L1440 94 V120 Z',
    1,
  ],
]

/**
 * The silhouette as the edge of a block rather than a divider between two. `fill`
 * is the colour of whatever the mountains are biting *into* — wine-deep when the
 * band is below, cream when the dark header is above.
 */
export function RidgeEdge({
  fill,
  className = '',
}: {
  fill: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 w-full ${className}`}
    >
      {LAYERS.map(([d, opacity]) => (
        <path key={d} d={d} fill={fill} opacity={opacity} />
      ))}
    </svg>
  )
}
