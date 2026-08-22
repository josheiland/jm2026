/**
 * The haze the vineyard is named for, sat behind the names.
 *
 * Deliberately not `Ridgeline`: this profile is much shallower (peak-to-valley is
 * roughly 20 units in a 300 viewBox against Ridgeline's ~50 in 120) because the
 * tallest peak has to clear the countdown baseline. A ridge behind the names reads
 * as a picture; this reads as weather, which is the point.
 */
export default function HazeWash({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[104px] w-full md:h-[150px] ${className}`}
    >
      <path
        d="M0 300 V222 L180 210 L360 224 L540 206 L720 220 L900 208 L1080 222 L1260 210 L1440 220 V300 Z"
        fill="#63494a"
        opacity="0.05"
      />
      <path
        d="M0 300 V250 L200 240 L400 252 L600 238 L800 250 L1000 240 L1200 252 L1440 242 V300 Z"
        fill="#63494a"
        opacity="0.05"
      />
      <path
        d="M0 300 V276 L240 268 L480 278 L720 266 L960 278 L1200 268 L1440 276 V300 Z"
        fill="#63494a"
        opacity="0.06"
      />
    </svg>
  )
}
