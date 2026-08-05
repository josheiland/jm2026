import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServiceWorker from '@/components/ServiceWorker'
import './globals.css'

// Headings, body copy and the ampersand, separated by weight.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  // Required for the share image to resolve to an absolute URL.
  metadataBase: new URL('https://eilands2026.vercel.app'),
  title: {
    default: 'Mary & Josh · September 6, 2026',
    template: '%s · Mary & Josh',
  },
  description:
    'Everything you need for the weekend of September 5 to 7, 2026 in Charlottesville, Virginia.',
  openGraph: {
    title: 'Mary & Josh · September 6, 2026',
    description: 'Everything for the weekend in Charlottesville. Schedule, buses, photos.',
    siteName: 'Mary & Josh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
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
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
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
        <ServiceWorker />
      </body>
    </html>
  )
}
