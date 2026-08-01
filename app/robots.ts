import type { MetadataRoute } from 'next'

// The site is public — anyone with the link gets in, which is what we want for
// 151 guests of varying technical patience. It should not be *findable*, though:
// the guest list has no business in a search index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  }
}
