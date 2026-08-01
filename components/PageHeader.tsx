export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede?: string
}) {
  return (
    <header className="content pt-16 md:pt-24 pb-10 md:pb-14">
      <p className="eyebrow fade-up">{eyebrow}</p>
      <h1
        className="display text-5xl md:text-7xl mt-4 fade-up"
        style={{ animationDelay: '60ms' }}
      >
        {title}
      </h1>
      {lede && (
        <p
          className="mt-6 text-lg md:text-xl text-ink/65 max-w-2xl leading-relaxed fade-up"
          style={{ animationDelay: '120ms' }}
        >
          {lede}
        </p>
      )}
      <div className="rule mt-10" />
    </header>
  )
}
