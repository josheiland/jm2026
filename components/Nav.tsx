'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '/schedule', label: 'Schedule' },
  { href: '/photos', label: 'Share Photos' },
  { href: '/guests', label: 'Who’s Coming' },
  { href: '/charlottesville', label: 'Charlottesville' },
  { href: '/faq', label: 'FAQs' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation, and lock scroll while it's open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? 'bg-cream/95 backdrop-blur-md border-b border-wine/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
      <nav className="content flex items-center justify-between h-16 md:h-20" aria-label="Main">
        <Link href="/" className="group flex items-baseline gap-1.5 shrink-0" aria-label="Home">
          <span className="display text-xl md:text-2xl tracking-tight">M</span>
          <span className="amp text-lg md:text-xl">&amp;</span>
          <span className="display text-xl md:text-2xl tracking-tight">J</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[0.85rem] uppercase tracking-[0.14em] transition-colors ${
                    active ? 'text-wine' : 'text-ink/60 hover:text-wine'
                  }`}
                >
                  {l.label}
                  <span
                    className={`block h-px mt-1.5 bg-wine transition-all duration-300 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden -mr-2 p-2 text-wine"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d={open ? 'M4 4 L18 18 M18 4 L4 18' : 'M2 6 H20 M2 11 H20 M2 16 H20'}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>
      </header>

      {/*
        Sibling of the header, not a child. The header uses backdrop-blur, and
        backdrop-filter creates a containing block for fixed descendants, which would
        collapse this to the height of the header.
      */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-cream border-t border-wine/10 overflow-y-auto"
      >
        <ul className="content py-6 flex flex-col">
          {LINKS.map((l, i) => (
            <li key={l.href} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Link
                href={l.href}
                className="flex items-baseline justify-between py-4 border-b border-wine/10"
              >
                <span className="display text-2xl">{l.label}</span>
                <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            </li>
          ))}
          <li className="pt-8">
            <Link
              href="/#thank-you"
              className="eyebrow hover:text-wine transition-colors"
            >
              A note from us →
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
