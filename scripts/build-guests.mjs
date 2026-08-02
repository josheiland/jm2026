// Builds data/guests.json from the live "Invite list" tab of the wedding spreadsheet.
//
//   npm run guests
//
// The sheet is the single source of truth: one row per person, with both the table
// assignment and the "how do we know them" category. Table "H" is the head table —
// the wedding party and their significant others, plus Mary and Josh. Table "--"
// means not attending, and those rows are dropped.
//
// This replaced a join across two exported CSVs sitting in ~/Downloads. That version
// had to *infer* a category for 17 plus-ones who appeared on the seating chart but
// not the invite list. Every row in the sheet carries its own category, so nothing
// is inferred any more, and edits to the sheet show up on the next run.
//
// PRIVACY: the source has an Email and Address column for all 236 people. Neither is
// read here, and the raw CSV is never written to disk — only the sanitised JSON.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const SHEET_ID = '1JWQOhhQe9qJm__DLf0nPMNUaIgYgNtT9K-jvLsSXaSQ'
const INVITE_GID = '671993309' // "Invite list" tab
const SOURCE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${INVITE_GID}`

/** Minimal RFC-4180 parser — the address column contains quoted commas and newlines. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  const s = text.replace(/^﻿/, '').replace(/\r\n/g, '\n')

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ } else { quoted = false }
      } else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const norm = (s) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim()

// ---- how-we-know-them labels, in the order they appear on the page ------------------

// Groupings agreed on the Aug 1 review call: UVA merged into one, Stanford folded
// together with the Bay, and family friends merged with the hometown crowd.
// Blurbs are one line, dry, and never explain the obvious.
const GROUPS = [
  { key: 'us',            match: 'Us :)',                 label: 'Us',               blurb: 'Hi' },
  { key: 'mary-family',   match: 'Mary family',           label: "Mary's Family",    blurb: 'Blankemeiers and Ryans. You will hear them before you see them' },
  { key: 'josh-family',   match: 'Josh family',           label: "Josh's Family",    blurb: 'Eilands and Carrons' },
  { key: 'family-friends',match: 'Josh family friends',   label: 'Hometown Friends', blurb: 'Around long enough to own photographs we would rather they did not' },
  { key: 'mary-family-friends', match: 'Mary family friends', label: 'Hometown Friends', blurb: '' },
  { key: 'chicago',       match: 'Chicago family friends',label: 'Hometown Friends', blurb: '' },
  { key: 'mary-hs',       match: 'Mary HS friends',       label: 'Hometown Friends', blurb: '' },
  { key: 'josh-hs',       match: 'Josh HS friends',       label: 'Hometown Friends', blurb: '' },
  { key: 'boston',        match: 'Boston friends',        label: 'Boston',           blurb: 'Our twenties, basically' },
  { key: 'uva-mary',      match: 'Mary college friends',  label: 'UVA',              blurb: 'Wahoos' },
  { key: 'uva-josh',      match: 'Josh college friends',  label: 'UVA',              blurb: '' },
  { key: 'uva',           match: 'College friend',        label: 'UVA',              blurb: '' },
  { key: 'stanford',      match: 'Stanford friends',      label: 'Stanford & the Bay', blurb: 'The current chapter, and everyone west of it' },
  { key: 'sf',            match: 'SF friends',            label: 'Stanford & the Bay', blurb: '' },
  { key: 'ryc',           match: 'RYC',                   label: 'Run Your City',    blurb: 'Ten thousand kids, seventy-five chapters, and a running camp in Rwanda' },
]

const byMatch = new Map(GROUPS.map((g) => [g.match, g]))

/**
 * People the Type column files in the wrong place. Keyed by normalised name, valued
 * with the Type they should be treated as.
 */
const TYPE_OVERRIDES = {
  // Mary's aunt, and the officiant. Belongs with family, not in a group of her own.
  'mary davis': 'Mary family',
  // The Raisches are Mary's family, not family friends.
  'susie raisch': 'Mary family',
  'ken raisch': 'Mary family',
  'jack raisch': 'Mary family',
}

/**
 * The same name can appear twice because two people share it, or because a row was
 * duplicated. Confirmed real pairs go here; anything else is reported as suspect.
 */
const KNOWN_DISTINCT = new Set([
  'Bill Blankemeier', // confirmed by Josh 2026-08-01: two people, tables 1 and 2
])

const HEAD = 'H'
const NOT_ATTENDING = '--'

// ---- fetch --------------------------------------------------------------------------

const res = await fetch(SOURCE)
if (!res.ok) {
  console.error(`Could not read the sheet (${res.status}).`)
  console.error('It must be shared as "anyone with the link can view".')
  process.exit(1)
}
const rows = parseCsv(await res.text())

const header = rows[0].map((h) => h.trim())
const iTable = header.indexOf('Table')
const iName = header.indexOf('Name')
const iType = header.indexOf('Type')
if (iTable < 0 || iName < 0 || iType < 0) {
  console.error(`Sheet columns changed — expected Table/Name/Type, got: ${header.slice(0, 6).join(', ')}`)
  process.exit(1)
}

// ---- build --------------------------------------------------------------------------

const problems = []
const guests = []

for (const r of rows.slice(1)) {
  const table = (r[iTable] ?? '').trim()
  const name = (r[iName] ?? '').trim()
  const type = (r[iType] ?? '').trim()

  if (!name || !table || table === NOT_ATTENDING) continue

  const effectiveType = TYPE_OVERRIDES[norm(name)] ?? type
  const group = byMatch.get(effectiveType)
  if (!group) {
    problems.push(`unrecognised Type ${JSON.stringify(type)} for ${name}`)
    continue
  }

  const headTable = table === HEAD
  guests.push({
    name,
    table,
    tableLabel: headTable ? 'Head Table' : `Table ${table}`,
    tableSort: headTable ? 0 : Number(table),
    group: group.label,
    groupKey: group.key,
    headTable,
    isCouple: type === 'Us :)',
  })
}

// ---- integrity ----------------------------------------------------------------------

const nameCounts = new Map()
for (const g of guests) nameCounts.set(g.name, (nameCounts.get(g.name) ?? 0) + 1)
const duplicateNames = [...nameCounts.entries()].filter(([, n]) => n > 1).map(([n]) => n)
const suspectDuplicates = duplicateNames.filter((n) => !KNOWN_DISTINCT.has(n))

// A duplicated row must never silently inflate the total.
const totalSeated =
  guests.length - suspectDuplicates.reduce((sum, n) => sum + (nameCounts.get(n) - 1), 0)
const guestCount = totalSeated - guests.filter((g) => g.isCouple).length

// ---- group for display ---------------------------------------------------------------

const order = []
for (const g of GROUPS) if (!order.includes(g.label)) order.push(g.label)

const groups = order
  .map((label) => {
    const source =
      GROUPS.find((g) => g.label === label && g.blurb) ??
      GROUPS.find((g) => g.label === label)
    const members = guests
      .filter((x) => x.group === label)
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    return { label, blurb: source.blurb ?? '', count: members.length, members }
  })
  .filter((g) => g.count > 0)

const tables = [...new Set(guests.map((g) => g.table))]
  .sort((a, b) => (a === HEAD ? -1 : b === HEAD ? 1 : Number(a) - Number(b)))

const out = {
  source: 'Google Sheet "Invite list" tab',
  totalSeated,
  guestCount,
  headTableCount: guests.filter((g) => g.headTable).length,
  tableCount: tables.length,
  duplicateNames,
  suspectDuplicates,
  groups,
  guests: guests.slice().sort((a, b) => a.name.localeCompare(b.name, 'en')),
}

mkdirSync(join(ROOT, 'data'), { recursive: true })
writeFileSync(join(ROOT, 'data', 'guests.json'), JSON.stringify(out, null, 2) + '\n')

console.log(
  `${totalSeated} seated · ${guestCount} guests · ${out.headTableCount} at the head table · ${tables.length} tables`,
)
for (const g of groups) console.log(`  ${String(g.count).padStart(3)}  ${g.label}`)
if (suspectDuplicates.length) console.log(`\n⚠ unconfirmed duplicate names: ${suspectDuplicates.join(', ')}`)
if (problems.length) console.log(`\n⚠ ${problems.length} row(s) skipped:\n   ${problems.join('\n   ')}`)
