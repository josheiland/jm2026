'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Two puppies, one in a bow tie and one in a flower crown. On theme, given the
 * irresponsible number of them fostered out of rooms 45 and 47.
 *
 * Drawn Peanuts-adjacent: oversized head, long floppy ears, a snout, dot eyes
 * that squeeze shut when something good happens. Arrived at by rendering and
 * looking rather than by writing paths hopefully. Things that lost along the way:
 * solid dark ears (a heavy mass that swallowed the face at small sizes), a veil on
 * the bride pup (dissolved into stray strokes below about 80px), and posed dance
 * arms (unreadable at 70px, and the ears were in the way). Motion carries the
 * character instead, which reads at any size.
 *
 * Colour: two variables swapped together, so the pups invert over a dark backdrop
 * rather than vanishing into it. Anything dark on the page is tagged
 * data-pup-dark, and an observer watching only the bottom strip of the viewport
 * decides which way round each pup should be.
 */

const Pup = ({ accessory }: { accessory: 'bow' | 'crown' }) => (
  <svg viewBox="0 0 120 128" className="w-full h-full overflow-visible" aria-hidden="true">
    {/* motion dashes, timed to the hop */}
    <g className="pup-dashes">
      <path className="pup-line pup-line-thin" d="M16 96 L8 100" opacity="0.8" />
      <path className="pup-line pup-line-thin" d="M18 104 L11 109" opacity="0.8" />
      <path className="pup-line pup-line-thin" d="M104 96 L112 100" opacity="0.8" />
      <path className="pup-line pup-line-thin" d="M102 104 L109 109" opacity="0.8" />
    </g>

    <g className="pup-heart">
      <path
        className="pup-solid"
        d="M97 15 C97 11.5 92.5 9.5 90.5 13 C88.5 9.5 84 11.5 84 15 C84 19.5 90.5 24.5 90.5 24.5 C90.5 24.5 97 19.5 97 15 Z"
      />
    </g>

    <g className="pup-wag">
      <path className="pup-line" d="M80 92 C90 89 93 80 88 75" />
    </g>

    {/* body, filled so the limbs and head tuck behind it cleanly */}
    <ellipse className="pup-shape" cx="60" cy="93" rx="20" ry="16" />
    <ellipse className="pup-shape" cx="50" cy="110" rx="8" ry="5" />
    <ellipse className="pup-shape" cx="70" cy="110" rx="8" ry="5" />

    {/* head, ears and face tilt as one unit; the bow sits on the neck and stays put */}
    <g className="pup-tilt">
      {/* ears sit behind the head, so the roots hide and the lobes hang clear */}
      <g className="pup-ear-l">
        <path className="pup-shape" d="M42 32 C29 36 25 56 31 70 C35 79 45 79 48 69 C51 60 47 42 42 32 Z" />
      </g>
      <g className="pup-ear-r">
        <path className="pup-shape" d="M78 32 C91 36 95 56 89 70 C85 79 75 79 72 69 C69 60 73 42 78 32 Z" />
      </g>

      <circle className="pup-shape" cx="60" cy="46" r="25" />
      <ellipse className="pup-shape" cx="60" cy="60" rx="13.5" ry="10" />

      {/* resting eyes, which also blink */}
      <g className="pup-eyes-open">
        <circle className="pup-solid" cx="52" cy="43" r="3" />
        <circle className="pup-solid" cx="68" cy="43" r="3" />
      </g>
      {/* and the delighted ones, timed to the dance */}
      <g className="pup-eyes-glad">
        <path className="pup-line pup-line-eye" d="M48 44 C50.5 39.5 54.5 39.5 57 44" />
        <path className="pup-line pup-line-eye" d="M63 44 C65.5 39.5 69.5 39.5 72 44" />
      </g>

      <ellipse className="pup-solid" cx="60" cy="55" rx="4.2" ry="3.2" />
      <path className="pup-line" d="M55 61 C57 64.5 63 64.5 65 61" />

      {accessory === 'crown' && (
        <>
          <circle className="pup-line" cx="47" cy="25" r="3.6" />
          <circle className="pup-line" cx="60" cy="20" r="4.2" />
          <circle className="pup-line" cx="73" cy="25" r="3.6" />
        </>
      )}
    </g>

    {accessory === 'bow' && (
      <>
        <path className="pup-line" d="M60 75 L51 70.5 L51 80 Z M60 75 L69 70.5 L69 80 Z" />
        <circle className="pup-solid" cx="60" cy="75.5" r="1.9" />
      </>
    )}
  </svg>
)

/** Stacked wrappers: one transform per animation, outermost tricks first. */
const Performer = ({
  accessory,
  flips,
  delay,
}: {
  accessory: 'bow' | 'crown'
  flips: boolean
  delay: number
}) => {
  const inner = (
    <div className="pup-hop" style={{ animationDelay: `${delay + 2}s` }}>
      <div className="pup-dance" style={{ animationDelay: `${delay}s` }}>
        <div className="pup-sniff" style={{ animationDelay: `${delay + 5}s` }}>
          <div className="pup-breathe" style={{ animationDelay: `${delay * 0.3}s` }}>
            <Pup accessory={accessory} />
          </div>
        </div>
      </div>
    </div>
  )
  return flips ? (
    <div className="pup-flip" style={{ animationDelay: `${delay + 9}s` }}>
      {inner}
    </div>
  ) : (
    inner
  )
}

function useDarkBackdrop() {
  const [dark, setDark] = useState(false)
  const hits = useRef(new Set<Element>())

  useEffect(() => {
    const targets = document.querySelectorAll('[data-pup-dark]')
    if (!targets.length) return

    let io: IntersectionObserver | null = null
    const build = () => {
      io?.disconnect()
      // Watch only where the pups' mass actually sits. Any overlap flips them,
      // so a strip much taller than the pups would invert them while they are
      // still standing on cream.
      const strip = 78
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.current.add(e.target)
            else hits.current.delete(e.target)
          }
          setDark(hits.current.size > 0)
        },
        { rootMargin: `-${Math.max(0, window.innerHeight - strip)}px 0px 0px 0px` },
      )
      targets.forEach((t) => io!.observe(t))
    }
    build()
    window.addEventListener('resize', build)
    return () => {
      io?.disconnect()
      window.removeEventListener('resize', build)
    }
  }, [])

  return dark
}

export default function Puppies() {
  const dark = useDarkBackdrop()
  const tone = dark ? 'pup pup-dark' : 'pup'

  return (
    <>
      {/* Narrow enough that there is no gutter: stand them in the flow just above
          the footer ridgeline, where they overlap nothing. The -mb closes the
          footer's mt-24 so they read as standing on the mountains rather than
          floating in a gap. */}
      <div
        aria-hidden="true"
        className="min-[1240px]:hidden -mb-24 flex items-end justify-between px-3 pt-6 pup"
      >
        <div className="w-[62px] sm:w-[76px]">
          <Performer accessory="crown" flips={false} delay={0} />
        </div>
        <div className="w-[62px] sm:w-[76px]" style={{ transform: 'scaleX(-1)' }}>
          <Performer accessory="bow" flips delay={7} />
        </div>
      </div>

      {/* Wide enough for a real gutter: fix them in the bottom corners, outside
          the 68rem text column. Below 1240px the column reaches the pups and they
          would sit on top of copy, which is why this breakpoint is a measurement
          and not a guess: (vw - 1088) / 2 + 40 has to clear left-5 + 88. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden min-[1240px]:block ${tone}`}
      >
        <div className="relative mx-auto max-w-[100rem]">
          <div className="absolute bottom-1 left-5 w-[88px]">
            <Performer accessory="crown" flips={false} delay={0} />
          </div>
          <div
            className="absolute bottom-1 right-5 w-[88px]"
            style={{ transform: 'scaleX(-1)' }}
          >
            <Performer accessory="bow" flips delay={7} />
          </div>
        </div>
      </div>
    </>
  )
}
