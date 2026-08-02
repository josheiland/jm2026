#!/usr/bin/env node
/**
 * One-time Google Drive setup for the photo portal.
 *
 *   node scripts/google-auth.mjs
 *
 * Does four things:
 *   1. Walks you through the OAuth consent in your browser (localhost callback).
 *   2. Exchanges the code for a refresh token.
 *   3. Finds or creates the "Mary & Josh — Guest Photos" folder in your Drive.
 *   4. Performs a REAL test upload and deletes it, so you know the whole chain works
 *      before a single guest touches it.
 *
 * Then prints the four environment variables to paste into Vercel.
 *
 * Scope is drive.file — this app can only ever see files it created itself. It cannot
 * read anything else in the account.
 */

import http from 'node:http'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { spawn } from 'node:child_process'

const PORT = 4571
// Loopback redirect for an installed ("Desktop app") client. Google accepts
// http://127.0.0.1 on any port for this client type without it being registered
// anywhere, which removes redirect_uri_mismatch as a possible failure entirely.
// 127.0.0.1 rather than localhost is Google's documented preference.
const REDIRECT = `http://127.0.0.1:${PORT}/callback`
const SCOPE = 'https://www.googleapis.com/auth/drive.file'
const FOLDER_NAME = 'Mary & Josh — Guest Photos'

const b = (s) => `\x1b[1m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`

console.log(`
${b('Google Drive setup — photo portal')}

Before you start, create an OAuth client. Takes about five minutes:

  1. Go to  ${b('https://console.cloud.google.com/projectcreate')}
     Create a project. Call it anything — "wedding" is fine.

  2. Enable the Drive API:
     ${dim('APIs & Services → Library → search "Google Drive API" → Enable')}

  3. Configure the consent screen:
     ${dim('APIs & Services → OAuth consent screen')}
     User type ${b('External')}. Fill in the three required fields. Add the scope
     ${dim(SCOPE)}

  4. ${red('IMPORTANT')} — on the consent screen, click ${b('PUBLISH APP')}.
     If you leave it in "Testing", Google silently expires your refresh token after
     ${b('7 days')} and the upload portal dies mid-weekend. drive.file is a
     non-sensitive scope, so publishing needs no review from Google.

  5. Create the credentials:
     ${dim('APIs & Services → Credentials → Create credentials → OAuth client ID')}
     Application type ${b('Desktop app')}.

     ${b('Choose "Desktop app", not "Web application".')} Desktop clients get
     loopback redirects accepted automatically, so there is no redirect URI to
     register and no way to get it wrong. If you already made a Web application
     client, just create a second one as Desktop app — you can ignore the old one.

  6. Copy the Client ID and Client Secret and paste them below.
     ${dim('Make sure they come from the Desktop client you just made, not an earlier one.')}
`)

const rl = createInterface({ input, output })
const clientId = (await rl.question(b('Client ID: '))).trim()
const clientSecret = (await rl.question(b('Client secret: '))).trim()
rl.close()

if (!clientId || !clientSecret) {
  console.error(red('\nBoth values are required. Nothing saved.'))
  process.exit(1)
}

// ---------------------------------------------------------------- oauth dance

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // force a refresh token even on re-runs
  })

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    if (url.pathname !== '/callback') {
      res.writeHead(404).end()
      return
    }
    const err = url.searchParams.get('error')
    const got = url.searchParams.get('code')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(
      `<body style="font-family:ui-serif,Georgia,serif;background:#F5EFE8;color:#43302f;display:grid;place-items:center;height:100vh;margin:0">
         <div style="text-align:center">
           <p style="font-size:2rem;margin:0">${err ? 'Something went wrong' : 'All set'}</p>
           <p style="opacity:.6">${err ? err : 'You can close this tab and go back to the terminal.'}</p>
         </div>
       </body>`,
    )
    server.close()
    err ? reject(new Error(err)) : resolve(got)
  })
  server.on('error', reject)
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`\nOpening your browser. If it doesn't open, paste this in:\n\n${dim(authUrl)}\n`)
    const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
    spawn(opener, [authUrl], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref()
  })

  // A redirect_uri_mismatch never reaches this server — Google refuses to redirect
  // at all — so without this the script would just hang looking successful.
  setTimeout(() => {
    console.log(
      dim(
        `\nStill waiting for the browser…\n` +
          `If you saw "Error 400: redirect_uri_mismatch", the client ID you pasted is a\n` +
          `${b('Web application')} client. Create a ${b('Desktop app')} client instead and re-run —\n` +
          `desktop clients accept ${REDIRECT} with nothing to register.\n`,
      ),
    )
  }, 45_000).unref()
})

// ---------------------------------------------------------------- token exchange

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT,
    grant_type: 'authorization_code',
  }),
})

if (!tokenRes.ok) {
  console.error(red(`\nToken exchange failed (${tokenRes.status}):`), await tokenRes.text())
  process.exit(1)
}

const { access_token: accessToken, refresh_token: refreshToken } = await tokenRes.json()

if (!refreshToken) {
  console.error(
    red('\nGoogle did not return a refresh token.') +
      '\nRevoke this app at https://myaccount.google.com/permissions and run this again.',
  )
  process.exit(1)
}

const auth = { Authorization: `Bearer ${accessToken}` }

// ---------------------------------------------------------------- folder

const q = encodeURIComponent(
  `name = '${FOLDER_NAME.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
)
const found = await (
  await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, { headers: auth })
).json()

let folderId = found.files?.[0]?.id

if (folderId) {
  console.log(green(`\n✓ Found the existing album folder`))
} else {
  const created = await (
    await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
    })
  ).json()
  folderId = created.id
  console.log(green(`\n✓ Created the album folder in your Drive`))
}

// ---------------------------------------------------------------- live test

process.stdout.write('  Testing a real upload… ')

const sessionRes = await fetch(
  'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
  {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': 'text/plain',
    },
    body: JSON.stringify({ name: '__setup-test.txt', parents: [folderId] }),
  },
)

const sessionUri = sessionRes.headers.get('location')
if (!sessionRes.ok || !sessionUri) {
  console.log(red('failed'))
  console.error(await sessionRes.text())
  process.exit(1)
}

const putRes = await fetch(sessionUri, { method: 'PUT', body: 'setup test' })
if (!putRes.ok) {
  console.log(red('failed on upload'))
  console.error(await putRes.text())
  process.exit(1)
}

const uploaded = await putRes.json()
await fetch(`https://www.googleapis.com/drive/v3/files/${uploaded.id}`, {
  method: 'DELETE',
  headers: auth,
})
console.log(green('worked, and cleaned up after itself'))

// ---------------------------------------------------------------- output

console.log(`
${b('Done. Add these four to Vercel:')}

${dim('  vercel env add GOOGLE_CLIENT_ID production')}
${dim('  … and so on for each, or paste them in the dashboard')}

GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
GOOGLE_REFRESH_TOKEN=${refreshToken}
GOOGLE_DRIVE_FOLDER_ID=${folderId}

${b('Or do it in one go:')}

  printf '%s' "${clientId}"      | vercel env add GOOGLE_CLIENT_ID production
  printf '%s' "${clientSecret}"  | vercel env add GOOGLE_CLIENT_SECRET production
  printf '%s' "${refreshToken}"  | vercel env add GOOGLE_REFRESH_TOKEN production
  printf '%s' "${folderId}"      | vercel env add GOOGLE_DRIVE_FOLDER_ID production

Then redeploy, and check ${b('/api/upload/health')} — it should report ok: true.

Your album: ${b(`https://drive.google.com/drive/folders/${folderId}`)}
`)
