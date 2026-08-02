#!/usr/bin/env node
/**
 * Works out which redirect URIs a Google OAuth client actually has registered.
 *
 *   node scripts/diagnose-oauth.mjs <client-id>
 *
 * Google validates client_id and redirect_uri at the /authorize endpoint *before*
 * any sign-in happens, and encodes the reason in a base64 `authError` parameter on
 * the error redirect. So we can probe candidate URIs without credentials, without a
 * browser, and without touching the account — the response tells us whether that
 * exact string is registered.
 *
 * A client ID is not a secret. It is visible in the URL of every OAuth consent
 * screen. Nothing here exposes anything.
 */

const clientId = process.argv[2]

if (!clientId) {
  console.error('Usage: node scripts/diagnose-oauth.mjs <client-id>')
  process.exit(1)
}

const CANDIDATES = [
  'http://127.0.0.1:4571/callback',
  'http://localhost:4571/callback',
  'https://localhost:4571/callback',
  'http://localhost:4571/',
  'http://localhost:4571',
  'http://127.0.0.1:4571',
  'http://localhost:3000/callback',
  'https://eilands2026.vercel.app',
  'https://eilands2026.vercel.app/callback',
]

const b = (s) => `\x1b[1m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`

/** Pull the human-readable strings out of Google's protobuf-ish error blob. */
function decodeAuthError(url) {
  const raw = new URL(url).searchParams.get('authError')
  if (!raw) return null
  const buf = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
  const parts = buf.toString('latin1').match(/[\x20-\x7e]{4,}/g) ?? []
  return parts.join(' — ')
}

async function probe(redirectUri) {
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive.file',
      access_type: 'offline',
    })

  const res = await fetch(url, { redirect: 'manual' })
  const location = res.headers.get('location') ?? ''

  if (location.includes('authError')) {
    return { ok: false, reason: decodeAuthError(location) ?? 'unknown error' }
  }
  // No authError means Google accepted the client and the redirect URI, and is
  // sending us on to the sign-in / consent flow.
  return { ok: true, reason: 'accepted' }
}

console.log(`\n${b('Probing client')} ${dim(clientId)}\n`)

let anyAccepted = false
let clientBad = false

for (const uri of CANDIDATES) {
  const { ok, reason } = await probe(uri)
  if (ok) anyAccepted = true
  if (/client was not found|deleted_client|invalid_client/i.test(reason)) clientBad = true
  console.log(`  ${ok ? green('REGISTERED  ') : red('not registered')}  ${uri}`)
  if (!ok && !/redirect_uri_mismatch|Missing|invalid_request/i.test(reason)) {
    console.log(`      ${dim(reason)}`)
  }
}

console.log()

if (clientBad) {
  console.log(
    red('That client ID does not exist.') +
      '\nYou are pasting the ID of a client that was deleted, or from a different project.\n' +
      'Cloud Console → APIs & Services → Credentials, and copy the ID from the row you edited.\n',
  )
} else if (!anyAccepted) {
  console.log(
    red('The client exists, but none of those redirect URIs are registered on it.') +
      `\n\nMost likely one of:\n` +
      `  • You edited a different OAuth client than the one this ID belongs to.\n` +
      `  • The edit was not saved — the Console requires an explicit ${b('Save')}.\n` +
      `  • Changes can take a few minutes to propagate. Wait and re-run this.\n` +
      `\nRegister exactly this, character for character:\n  ${b('http://127.0.0.1:4571/callback')}\n`,
  )
} else {
  console.log(green('At least one redirect URI is registered and working.'))
  console.log(`Set REDIRECT in scripts/google-auth.mjs to a ${green('REGISTERED')} value above.\n`)
}
