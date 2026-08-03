import Link from 'next/link'
import { WHATSAPP_INVITE } from '@/lib/config'

/**
 * Renders `[text](href)` inside otherwise plain copy, so an FAQ answer that mentions
 * the WhatsApp group or the photo page can actually take you there instead of
 * describing where to go.
 *
 * `whatsapp` is a symbolic href resolved at render time, because the invite URL comes
 * from an environment variable and the copy should not have to know that.
 */

/** `[text](href)` for links, `~~text~~` for strikethrough. */
const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|~~([^~]+)~~/g

export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))

    // Strikethrough branch: no href captured.
    if (m[3] !== undefined) {
      parts.push(
        <s key={m.index} className="opacity-55">
          {m[3]}
        </s>,
      )
      last = m.index + m[0].length
      continue
    }

    const [, label, rawHref] = m
    const href = rawHref === 'whatsapp' ? WHATSAPP_INVITE : rawHref

    if (rawHref === 'whatsapp' && !WHATSAPP_INVITE) {
      // No invite configured yet: show the words, skip the dead link.
      parts.push(label)
    } else if (href.startsWith('/')) {
      parts.push(
        <Link key={m.index} href={href} className="text-wine link-underline">
          {label}
        </Link>,
      )
    } else {
      parts.push(
        <a
          key={m.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-wine link-underline"
        >
          {label}
        </a>,
      )
    }
    last = m.index + m[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
