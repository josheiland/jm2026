import { NextResponse } from 'next/server'
import { getAccessToken, readConfig } from '@/lib/drive'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Did this file actually land?
 *
 * Every other signal we have is client-side and therefore hostage to the same flaky
 * connection that caused the problem: a phone regularly delivers the whole file and
 * then loses the response, so the browser sees an error for an upload that succeeded.
 * Asking Drive from the server is the only answer that cannot be wrong, and it is what
 * decides whether a guest sees "uploaded" or "failed".
 */
export async function POST(request: Request) {
  const cfg = readConfig()
  if (!cfg) return NextResponse.json({ found: false, configured: false }, { status: 503 })

  let body: { names?: string[]; size?: number }
  try {
    body = (await request.json()) as { names?: string[]; size?: number }
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const names = (body.names ?? []).filter((n) => typeof n === 'string' && n).slice(0, 5)
  const size = body.size
  if (!names.length || typeof size !== 'number') {
    return NextResponse.json({ error: 'Missing file details.' }, { status: 400 })
  }

  try {
    const token = await getAccessToken(cfg)
    // Drive query strings escape a single quote with a backslash.
    const clauses = names.map((n) => `name = '${n.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`)
    const q = `'${cfg.folderId}' in parents and trashed = false and (${clauses.join(' or ')})`

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,size)`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) throw new Error(`Drive lookup failed (${res.status})`)

    const { files } = (await res.json()) as { files: { id: string; name: string; size?: string }[] }
    // Size has to match too, so a half-written file is never reported as complete.
    const match = files.find((f) => Number(f.size ?? 0) === size)

    return NextResponse.json({ found: Boolean(match), name: match?.name ?? null })
  } catch (err) {
    console.error('[upload/verify]', err)
    return NextResponse.json({ found: false, error: 'lookup failed' }, { status: 502 })
  }
}
