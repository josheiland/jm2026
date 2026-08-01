import { NextResponse } from 'next/server'
import { countFiles, readConfig } from '@/lib/drive'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Proves the whole Drive chain is alive: refresh token still valid, folder still
 * reachable. Worth hitting the morning of the wedding.
 */
export async function GET() {
  const cfg = readConfig()
  if (!cfg) {
    return NextResponse.json(
      { ok: false, configured: false, reason: 'Google Drive env vars are not set.' },
      { status: 503 },
    )
  }

  try {
    const count = await countFiles(cfg)
    return NextResponse.json({ ok: true, configured: true, files: count })
  } catch (err) {
    return NextResponse.json(
      { ok: false, configured: true, reason: (err as Error).message },
      { status: 502 },
    )
  }
}
