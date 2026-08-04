'use client'

import { useEffect, useState } from 'react'

/**
 * Two line-drawn puppies, one in a bow tie and one in a flower crown. On theme:
 * they fostered an irresponsible number of these out of rooms 45 and 47.
 *
 * A veil was the obvious choice for the bride pup and it lost a bake-off against
 * the flower crown, which stays legible at the ~70px these actually render at
 * while the veil dissolved into stray strokes.
 *
 * Placement differs by screen, because a fixed corner element behaves very
 * differently at 1280 than at 390. On a desktop the text column has wide margins
 * and the pups sit in them happily. On a phone there are no margins, so a fixed
 * pup lands on top of whatever you are trying to read. There they live in the flow
 * just above the footer instead, where they overlap nothing.
 *
 * The fixed pair fades over the footer, which is the same wine they are drawn in
 * and would otherwise swallow them.
 */

const Pup = ({ accessory }: { accessory: 'bow' | 'crown' }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible" aria-hidden="true">
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* body and front paws */}
      <path d="M46 66 C39 74 36 88 39 98 C41 105 49 108 60 108 C71 108 79 105 81 98 C84 88 81 74 74 66" />
      <ellipse cx="50" cy="107" rx="7.5" ry="4.5" />
      <ellipse cx="70" cy="107" rx="7.5" ry="4.5" />

      <g className="pup-wag">
        <path d="M82 96 C93 94 98 83 92 75" />
      </g>

      <g className="pup-sniff">
        <circle cx="60" cy="44" r="25" />
        {/* floppy ears */}
        <path d="M41 29 C27 30 22 46 27 60 C31 70 42 69 45 57" />
        <path d="M79 29 C93 30 98 46 93 60 C89 70 78 69 75 57" />
        {/* muzzle and smile */}
        <path d="M51 55 C51 63 55 67 60 67 C65 67 69 63 69 55" />
        <path d="M55 59 C56.5 61.5 63.5 61.5 65 59" />
        <circle cx="51" cy="42" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="69" cy="42" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="60" cy="53" r="3" fill="currentColor" stroke="none" />

        {accessory === 'crown' && (
          <>
            <circle cx="47" cy="22" r="3.6" />
            <circle cx="60" cy="18" r="4.2" />
            <circle cx="73" cy="22" r="3.6" />
          </>
        )}
      </g>

      {accessory === 'bow' && (
        <>
          <path d="M60 72 L49 67 L49 78 Z M60 72 L71 67 L71 78 Z" />
          <circle cx="60" cy="72.5" r="2" fill="currentColor" stroke="none" />
        </>
      )}
    </g>
  </svg>
)

/** Flower crown, trots toward the middle of the page now and then. */
const Bride = () => (
  <div className="pup-trot" style={{ animationDelay: '3s' }}>
    <div className="pup-hop" style={{ animationDelay: '1.5s' }}>
      <div className="pup-bob">
        <Pup accessory="crown" />
      </div>
    </div>
  </div>
)

/** Bow tie, prone to the occasional backflip. Mirrored so he faces inward. */
const Groom = () => (
  <div style={{ transform: 'scaleX(-1)' }}>
    <div className="pup-flip" style={{ animationDelay: '11s' }}>
      <div className="pup-hop" style={{ animationDelay: '7s' }}>
        <div className="pup-bob" style={{ animationDelay: '0.8s' }}>
          <Pup accessory="bow" />
        </div>
      </div>
    </div>
  </div>
)

export default function Puppies() {
  const [overFooter, setOverFooter] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const io = new IntersectionObserver(([entry]) => setOverFooter(entry.isIntersecting), {
      rootMargin: '0px 0px -40% 0px',
    })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* phones: in the flow, just above the footer */}
      <div
        aria-hidden="true"
        className="sm:hidden flex items-end justify-between px-3 pt-10 text-wine/60"
      >
        <div className="w-[58px]">
          <Bride />
        </div>
        <div className="w-[58px]">
          <Groom />
        </div>
      </div>

      {/* everything else: fixed in the bottom corners */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden sm:block transition-opacity duration-500 ${
          overFooter ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="relative mx-auto max-w-[100rem]">
          <div className="absolute bottom-2 left-2 md:left-5 w-[70px] md:w-[86px] text-wine/70">
            <Bride />
          </div>
          <div className="absolute bottom-2 right-2 md:right-5 w-[70px] md:w-[86px] text-wine/70">
            <Groom />
          </div>
        </div>
      </div>
    </>
  )
}
