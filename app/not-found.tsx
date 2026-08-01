import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="content-narrow py-32 text-center">
      <p className="amp text-7xl text-wine/25" aria-hidden="true">
        &amp;
      </p>
      <h1 className="display text-4xl md:text-5xl mt-4">This page eloped</h1>
      <p className="mt-4 text-ink/65">
        Nothing here. The schedule is probably what you were after.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/schedule"
          className="bg-wine text-cream px-7 py-3.5 text-sm uppercase tracking-[0.14em] hover:bg-wine-deep transition-colors"
        >
          See the schedule
        </Link>
        <Link
          href="/"
          className="border border-wine/25 text-wine px-7 py-3.5 text-sm uppercase tracking-[0.14em] hover:bg-wine hover:text-cream transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
