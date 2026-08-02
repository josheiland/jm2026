#!/usr/bin/env node
/**
 * Finds byte-identical duplicates in the guest photo album and moves the extras to
 * Drive's trash, keeping the earliest copy of each.
 *
 *   vercel env pull .env.local        # once, to get the Google credentials
 *   node --env-file=.env.local scripts/dedupe-album.mjs            # dry run
 *   node --env-file=.env.local scripts/dedupe-album.mjs --apply    # actually trash
 *
 * The uploader no longer creates duplicates on retry, and skips a file already picked
 * in the same session. Neither of those helps if a guest uploads the same photo from
 * two devices, or comes back the next day and picks it again, so this exists for the
 * weekend.
 *
 * Matching is on Drive's md5Checksum, so only genuinely identical bytes are touched.
 * Two different photos taken a second apart will never collide. Extras are trashed
 * rather than deleted, so a mistake is recoverable for 30 days.
 */

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID } =
  process.env

const APPLY = process.argv.includes('--apply')

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_DRIVE_FOLDER_ID) {
  console.error('Missing Google credentials. Run:  vercel env pull .env.local')
  console.error('then:  node --env-file=.env.local scripts/dedupe-album.mjs')
  process.exit(1)
}

const dim = (s) => `\x1b[2m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`

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
  console.error(red(`Token refresh failed (${tokenRes.status}).`), await tokenRes.text())
  process.exit(1)
}
const { access_token: token } = await tokenRes.json()
const auth = { Authorization: `Bearer ${token}` }

// Page through the folder; a wedding can easily pass the 1000-file default.
const files = []
let pageToken
do {
  const params = new URLSearchParams({
    q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
    fields: 'nextPageToken, files(id,name,size,md5Checksum,createdTime)',
    orderBy: 'createdTime',
    pageSize: '1000',
    ...(pageToken ? { pageToken } : {}),
  })
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, { headers: auth })
  if (!res.ok) {
    console.error(red(`Drive list failed (${res.status}).`), await res.text())
    process.exit(1)
  }
  const page = await res.json()
  files.push(...page.files)
  pageToken = page.nextPageToken
} while (pageToken)

const groups = new Map()
for (const f of files) {
  // Folders and Google-native files have no checksum; key on id so they never group.
  const key = f.md5Checksum ?? `unique:${f.id}`
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(f)
}

const dupeGroups = [...groups.values()].filter((g) => g.length > 1)
const extras = dupeGroups.flatMap((g) => g.slice(1))

console.log(`\n${files.length} file(s) in the album`)

if (!extras.length) {
  console.log(green('No duplicates.\n'))
  process.exit(0)
}

console.log(`${dupeGroups.length} set(s) of duplicates, ${extras.length} extra file(s):\n`)
for (const g of dupeGroups) {
  console.log(`  ${green('keep')}  ${g[0].name}  ${dim(g[0].createdTime)}`)
  for (const d of g.slice(1)) console.log(`  ${red('trash')} ${d.name}  ${dim(d.createdTime)}`)
  console.log()
}

if (!APPLY) {
  console.log(dim('Dry run. Re-run with --apply to move the extras to trash.\n'))
  process.exit(0)
}

let done = 0
for (const f of extras) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, {
    method: 'PATCH',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  })
  if (res.ok) done++
  else console.error(red(`  failed on ${f.name} (${res.status})`))
}
console.log(green(`${done} file(s) moved to Drive trash. Recoverable for 30 days.\n`))
