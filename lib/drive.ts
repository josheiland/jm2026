// Google Drive upload, server-side half.
//
// Architecture: the browser never sees a Google token. This module exchanges the
// long-lived refresh token for an access token, opens a *resumable upload session*
// against the Drive API, and hands the browser only the returned session URI. The
// browser then PUTs the bytes straight to Google.
//
// Two reasons it works this way:
//   1. Vercel functions cap request bodies at 4.5 MB. A phone video is 200 MB+.
//      Routing bytes through the function is simply not possible.
//   2. The session URI is a capability URL — it authorises exactly one upload of
//      one file and nothing else. Google sets `access-control-allow-origin` on the
//      upload host (verified against our origin), so the browser can PUT to it
//      directly with no credentials attached.
//
// Scope is `drive.file`, which grants access only to files this app itself created.
// It cannot read anything else in the account. It is also a non-sensitive scope, so
// the Cloud project needs no Google verification review.

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files'

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'

export interface DriveConfig {
  clientId: string
  clientSecret: string
  refreshToken: string
  folderId: string
}

export function readConfig(): DriveConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!clientId || !clientSecret || !refreshToken || !folderId) return null
  return { clientId, clientSecret, refreshToken, folderId }
}

// Access tokens last an hour. Warm serverless instances reuse this; cold ones refetch.
let cached: { token: string; expires: number } | null = null

export async function getAccessToken(cfg: DriveConfig): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      refresh_token: cfg.refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    // The classic cause: the Cloud project was left in "Testing" publishing status,
    // which silently expires refresh tokens after seven days.
    throw new Error(`Token refresh failed (${res.status}). ${body.slice(0, 300)}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cached = { token: json.access_token, expires: Date.now() + json.expires_in * 1000 }
  return json.access_token
}

/** Filenames sort chronologically and carry the uploader, so one folder stays usable. */
export function buildFilename(original: string, uploader: string) {
  const stamp = new Date()
    .toLocaleString('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/[/:]/g, '-')
    .replace(', ', '_')

  const who = (uploader || 'Guest')
    .trim()
    .replace(/[^\p{L}\p{N} '-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'Guest'

  const safe = original.replace(/[/\\?%*:|"<>]/g, '-').slice(-80)
  return `${stamp}__${who}__${safe}`
}

export async function createResumableSession(
  cfg: DriveConfig,
  opts: {
    filename: string
    mimeType: string
    size: number
    description?: string
    uploader?: string
    note?: string
  },
): Promise<string> {
  const token = await getAccessToken(cfg)

  const res = await fetch(`${DRIVE_UPLOAD}?uploadType=resumable&supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': opts.mimeType,
      'X-Upload-Content-Length': String(opts.size),
    },
    body: JSON.stringify({
      name: opts.filename,
      parents: [cfg.folderId],
      // description is human-readable but writable by anything with access, and some
      // uploads came back with Drive's own text in it. appProperties is private to
      // this app, so attribution written here cannot be clobbered.
      description: opts.description,
      appProperties: {
        ...(opts.uploader ? { uploader: opts.uploader.slice(0, 120) } : {}),
        ...(opts.note ? { note: opts.note.slice(0, 120) } : {}),
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Could not open upload session (${res.status}). ${body.slice(0, 300)}`)
  }

  const location = res.headers.get('location')
  if (!location) throw new Error('Drive did not return an upload session URI.')
  return location
}

/** Used by the health check and the "moments shared" counter. */
export async function countFiles(cfg: DriveConfig): Promise<number> {
  const token = await getAccessToken(cfg)
  const q = encodeURIComponent(`'${cfg.folderId}' in parents and trashed = false`)
  const res = await fetch(`${DRIVE_API}/files?q=${q}&fields=files(id)&pageSize=1000`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Drive list failed (${res.status})`)
  const json = (await res.json()) as { files: unknown[] }
  return json.files.length
}
