import Image from 'next/image'
import { PHOTOS, type Photo as PhotoData } from '@/lib/photos'

type Key = keyof typeof PHOTOS

/**
 * Every photo carries its own dimensions and an inlined blurred placeholder from
 * lib/photos.ts, so there is no layout shift and no blank grey box while the real
 * file loads over hotel wifi.
 */
export default function Photo({
  name,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = '',
  imgClassName = '',
  caption,
  dark = false,
}: {
  name: Key
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  caption?: string
  /** Tag a full-bleed band so the corner puppies invert over it. */
  dark?: boolean
}) {
  const p: PhotoData = PHOTOS[name]

  return (
    <figure className={className}>
      <div className="relative overflow-hidden bg-cream-deep" {...(dark ? { 'data-pup-dark': true } : {})}>
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={p.blur}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-sm text-ink/70 italic">{caption}</figcaption>
      )}
    </figure>
  )
}
