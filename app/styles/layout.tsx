import { Cormorant_Garamond, Fraunces, Lato, Libre_Baskerville } from 'next/font/google'

// Only loaded on this route. The live site ships one pairing; these are here so the
// alternatives can be compared side by side without slowing the real pages down.

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-baskerville',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${fraunces.variable} ${baskerville.variable} ${lato.variable}`}
    >
      {children}
    </div>
  )
}
