import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Tenor_Sans, Jost } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

// Stand-in for Sauvage, the commercial face the Zola site uses for headings.
const tenor = Tenor_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-tenor',
  display: 'swap',
})

// Kept only for the italic ampersand.
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  axes: ['opsz'],
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
    <html lang="en" className={`${tenor.variable} ${bodoni.variable} ${jost.variable}`}>
      <head>
        {/*
          Sauvage is first in the --font-display stack but is a commercial face with
          no free source. Set NEXT_PUBLIC_ADOBE_KIT to an Adobe Fonts web-project ID
          that includes it (with this domain allowlisted) and it resolves everywhere
          automatically, with Tenor Sans falling back until then.
        */}
        {process.env.NEXT_PUBLIC_ADOBE_KIT && (
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${process.env.NEXT_PUBLIC_ADOBE_KIT}.css`}
          />
        )}
      </head>
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
