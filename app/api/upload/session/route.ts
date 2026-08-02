import { NextResponse } from 'next/server'
import { buildFilename, createResumableSession, readConfig } from '@/lib/drive'
import { MAX_UPLOAD_BYTES } from '@/lib/config'

export const runtime = 'nodejs'

interface Body {
  name?: string
  mimeType?: string
  size?: number
  uploader?: string
  note?: string
}

export async function POST(request: Request) {
  const cfg = readConfig()
  if (!cfg) {
    return NextResponse.json(
      { error: 'Photo uploads are not switched on yet. Check back shortly.' },
      { status: 503 },
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const { name, mimeType, size, uploader, note } = body

  if (!name || !mimeType || typeof size !== 'number' || size <= 0) {
    return NextResponse.json({ error: 'Missing file details.' }, { status: 400 })
  }
  if (!/^(image|video)\//.test(mimeType)) {
    return NextResponse.json(
      { error: 'Photos and videos only, please.' },
      { status: 415 },
    )
  }
  if (size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: 'That file is over 5 GB, which is bigger than we can take.' },
      { status: 413 },
    )
  }

  const description = [
    uploader ? `From: ${uploader.trim().slice(0, 80)}` : null,
    note ? `Note: ${note.trim().slice(0, 400)}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const uploadUrl = await createResumableSession(cfg, {
      filename: buildFilename(name, uploader ?? ''),
      mimeType,
      size,
      description: description || undefined,
    })
    return NextResponse.json({ uploadUrl })
  } catch (err) {
    console.error('[upload/session]', err)
    return NextResponse.json(
      { error: 'Could not start the upload. Please try again in a moment.' },
      { status: 502 },
    )
  }
}
