import { DM_Sans, EB_Garamond, Lato } from 'next/font/google'

// Body-font candidates, loaded only on this route so the live pages stay light.
// Jost is already loaded globally and is the current default.

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans', display: 'swap' })
const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-ebgaramond', display: 'swap' })
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${dmSans.variable} ${ebGaramond.variable} ${lato.variable}`}
    >
      {children}
    </div>
  )
}
