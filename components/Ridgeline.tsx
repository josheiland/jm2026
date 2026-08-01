/**
 * The Blue Ridge, abstracted. Hazy Mountain sits in the foothills just west of
 * Charlottesville and the layered-haze silhouette is the single most recognisable
 * thing about the view from the vineyard — it does the work a hero photo would.
 */
export default function Ridgeline({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-[70px] md:h-[110px]"
      >
        <path
          d="M0 120 V78 L120 58 L245 74 L390 40 L520 66 L640 34 L780 62 L900 44 L1040 70 L1180 48 L1310 68 L1440 52 V120 Z"
          fill="#63494a"
          opacity="0.28"
        />
        <path
          d="M0 120 V92 L140 74 L280 90 L420 62 L560 84 L700 58 L840 82 L980 66 L1120 88 L1270 70 L1440 86 V120 Z"
          fill="#63494a"
          opacity="0.5"
        />
        <path
          d="M0 120 V104 L160 92 L320 104 L470 86 L620 102 L770 88 L920 104 L1080 92 L1240 106 L1440 94 V120 Z"
          fill="#43302f"
        />
      </svg>
    </div>
  )
}
