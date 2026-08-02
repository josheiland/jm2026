#!/usr/bin/env node
/**
 * Lists everything in the guest album with who sent it and what they said.
 *
 *   vercel env pull .env.local
 *   node --env-file=.env.local scripts/album-index.mjs           # readable table
 *   node --env-file=.env.local scripts/album-index.mjs --csv     # for a spreadsheet
 *
 * The uploader's name and note are stored in each file's Drive `description`, which
 * Drive only shows if you select a file and open the details pane. That is fine for
 * one photo and useless for four hundred, which is what this is for. Sorted by
 * uploader so it doubles as a thank-you list.
 */

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID } =
  process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_DRIVE_FOLDER_ID) {
  console.error('Missing Google credentials. Run:  vercel env pull .env.local')
  process.exit(1)
}

const CSV = process.argv.includes('--csv')

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  }),
})
if (!tokenRes.ok) {
  console.error(`Token refresh failed (${tokenRes.status}).`, await tokenRes.text())
  process.exit(1)
}
const { access_token: token } = await tokenRes.json()

const files = []
let pageToken
do {
  const params = new URLSearchParams({
    q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
    fields: 'nextPageToken, files(id,name,size,mimeType,description,appProperties,createdTime,webViewLink)',
    orderBy: 'createdTime',
    pageSize: '1000',
    ...(pageToken ? { pageToken } : {}),
  })
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    console.error(`Drive list failed (${res.status}).`, await res.text())
    process.exit(1)
  }
  const page = await res.json()
  files.push(...page.files)
  pageToken = page.nextPageToken
} while (pageToken)

const rows = files.map((f) => {
  const desc = f.description ?? ''
  const props = f.appProperties ?? {}
  return {
    // appProperties is authoritative; description is the readable copy and older
    // uploads only have that.
    from: (props.uploader ?? desc.match(/^From: (.*)$/m)?.[1] ?? '').trim(),
    note: (props.note ?? desc.match(/^Note: ([\s\S]*)$/m)?.[1] ?? '').trim(),
    name: f.name,
    when: f.createdTime.replace('T', ' ').slice(0, 16),
    mb: (Number(f.size ?? 0) / 1024 / 1024).toFixed(1),
    link: f.webViewLink ?? '',
  }
})

if (CSV) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  console.log(['From', 'Note', 'File', 'Uploaded', 'MB', 'Link'].join(','))
  for (const r of rows) {
    console.log([r.from, r.note, r.name, r.when, r.mb, r.link].map(esc).join(','))
  }
  process.exit(0)
}

if (!rows.length) {
  console.log('\nAlbum is empty.\n')
  process.exit(0)
}

// Group by sender: the useful view when writing thank-yous.
const byPerson = new Map()
for (const r of rows) {
  const who = r.from || '(no name given)'
  if (!byPerson.has(who)) byPerson.set(who, [])
  byPerson.get(who).push(r)
}

const dim = (s) => `\x1b[2m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

console.log(`\n${rows.length} file(s) from ${byPerson.size} ${byPerson.size === 1 ? 'person' : 'people'}\n`)

for (const [who, list] of [...byPerson.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const mb = list.reduce((s, r) => s + Number(r.mb), 0).toFixed(1)
  console.log(`${bold(who)}  ${dim(`${list.length} file(s), ${mb} MB`)}`)
  for (const r of list) {
    console.log(`   ${dim(r.when)}  ${r.name}`)
    if (r.note) console.log(`      “${r.note}”`)
  }
  console.log()
}

const withNotes = rows.filter((r) => r.note).length
console.log(dim(`${withNotes} of ${rows.length} came with a note.\n`))
