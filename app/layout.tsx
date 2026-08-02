import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Pinyon_Script, Jost } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  axes: ['opsz'],
})

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pinyon',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mary & Josh · September 6, 2026',
    template: '%s · Mary & Josh',
  },
  description:
    'Everything you need for the weekend of September 5 to 7, 2026 in Charlottesville, Virginia.',
  // Public URL, but the guest list has no business in a search index.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Mary & Josh', statusBarStyle: 'default' },
}

export const viewport: Viewport = {
  themeColor: '#f5efe8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${pinyon.variable} ${jost.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-wine focus:text-cream focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative z-10 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
