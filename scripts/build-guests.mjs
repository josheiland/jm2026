// Builds data/guests.json from the two source spreadsheets.
//
//   1. "Seating chart sign.csv"  (Aug 1) -> authoritative list of who is seated, and at which table
//   2. "Invite list (1).csv"     (Jul 19) -> the "how do we know them" category
//
// Plus-ones appear on the seating chart but not the invite list. Because tables are
// seated by affinity group, an unmatched guest inherits their table's dominant group.
// Those are flagged `inferred: true` so the site never claims more than it knows.
//
// Emails, phone numbers and home addresses exist in the sources and are deliberately
// never copied into the output — the site is public.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DL = '/Users/je/Downloads'

const SEATING = join(DL, 'Josh + Mary wedding - Seating chart sign.csv')
const INVITES = join(DL, 'Josh + Mary wedding invites - Invite list (1).csv')

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

// ---- how-we-know-them labels, in the order they should appear on the page -----------

const GROUPS = [
  { key: 'us',            match: 'Us :)',                 label: 'Us',                    blurb: 'The two of you. Hi.' },
  { key: 'mary-family',   match: 'Mary family',           label: "Mary's Family",         blurb: 'The Blankemeiers, Ryans, Savaianos and everyone who chanted "Josh! Josh! Josh!" at Thanksgiving.' },
  { key: 'josh-family',   match: 'Josh family',           label: "Josh's Family",         blurb: 'The Eilands and Carrons.' },
  { key: 'family-friends',match: 'Josh family friends',   label: 'Family Friends',        blurb: 'The people who have been around so long they are basically family.' },
  { key: 'mary-family-friends', match: 'Mary family friends', label: 'Family Friends',    blurb: '' },
  { key: 'chicago',       match: 'Chicago family friends',label: 'Family Friends',        blurb: '' },
  { key: 'boston',        match: 'Boston friends',        label: 'Boston',                blurb: 'The chapter right after graduation — the crew that made a new city feel like home.' },
  { key: 'uva-mary',      match: 'Mary college friends',  label: 'UVA — Mary',            blurb: 'Wahoos. Lawn residents. Study-session enablers.' },
  { key: 'uva-josh',      match: 'Josh college friends',  label: 'UVA — Josh',            blurb: 'Wahoos. Lawn residents. Study-session enablers.' },
  { key: 'uva',           match: 'College friend',        label: 'UVA',                   blurb: '' },
  { key: 'stanford',      match: 'Stanford friends',      label: 'Stanford',              blurb: 'The current chapter — GSB and the Farm.' },
  { key: 'sf',            match: 'SF friends',            label: 'The Bay',               blurb: '' },
  { key: 'ryc',           match: 'RYC',                   label: 'Run Your City',         blurb: '75+ chapters, 10,000+ kids, and the running camps in Rwanda that started it.' },
  { key: 'mary-hs',       match: 'Mary HS friends',       label: "Mary's Hometown",       blurb: 'Since before any of this.' },
  { key: 'josh-hs',       match: 'Josh HS friends',       label: "Josh's Hometown",       blurb: 'Since before any of this.' },
]

const byMatch = new Map(GROUPS.map((g) => [g.match, g]))

// People whose relationship the spreadsheet can't express. Keyed by normalised name.
const ROLE_OVERRIDES = {
  'mary davis': { label: 'Officiant', note: 'Marrying us.' },
}

// ---- read sources -------------------------------------------------------------------

const inviteRows = parseCsv(readFileSync(INVITES, 'utf8')).slice(1)
const typeByName = new Map()
for (const r of inviteRows) {
  const name = (r[0] || '').trim()
  const type = (r[1] || '').trim()
  if (name && type && byMatch.has(type)) typeByName.set(norm(name), type)
}

const seatRows = parseCsv(readFileSync(SEATING, 'utf8'))
const seatHeader = seatRows[0].map((h) => h.trim())
const iTable = seatHeader.indexOf('Table')
const iName = seatHeader.indexOf('Name')

const seated = []
for (const r of seatRows.slice(1)) {
  const name = (r[iName] || '').trim()
  const table = parseInt((r[iTable] || '').trim(), 10)
  if (!name || Number.isNaN(table)) continue
  seated.push({ name, table, match: typeByName.get(norm(name)) ?? null })
}

// ---- infer plus-ones from their table's dominant group -------------------------------

const dominantByTable = new Map()
for (const t of new Set(seated.map((g) => g.table))) {
  const counts = new Map()
  for (const g of seated) {
    if (g.table === t && g.match) counts.set(g.match, (counts.get(g.match) ?? 0) + 1)
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (top) dominantByTable.set(t, top[0])
}

let inferredCount = 0
const guests = seated.map((g) => {
  const override = ROLE_OVERRIDES[norm(g.name)]
  if (override) {
    return { name: g.name, table: g.table, group: override.label, groupKey: 'role', inferred: false }
  }
  const inferred = !g.match
  const match = g.match ?? dominantByTable.get(g.table) ?? 'Boston friends'
  if (inferred) inferredCount++
  const group = byMatch.get(match)
  return { name: g.name, table: g.table, group: group.label, groupKey: group.key, inferred }
})

// The seating chart is hand-maintained, so the same name can legitimately appear
// twice (two generations sharing a name) or by mistake. Surface it rather than
// silently collapsing or silently double-counting.
const nameCounts = new Map()
for (const g of guests) nameCounts.set(g.name, (nameCounts.get(g.name) ?? 0) + 1)
const duplicateNames = [...nameCounts.entries()].filter(([, n]) => n > 1).map(([n]) => n)

// ---- collapse to display groups (several source types share one label) ---------------

const order = []
for (const g of GROUPS) if (!order.includes(g.label)) order.push(g.label)
for (const o of Object.values(ROLE_OVERRIDES)) if (!order.includes(o.label)) order.push(o.label)

const groups = order
  .map((label) => {
    const source =
      GROUPS.find((g) => g.label === label && g.blurb) ??
      GROUPS.find((g) => g.label === label) ??
      Object.values(ROLE_OVERRIDES).find((o) => o.label === label)
    const members = guests.filter((x) => x.group === label)
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    return { label, blurb: source.blurb ?? source.note ?? '', count: members.length, members }
  })
  .filter((g) => g.count > 0)

const out = {
  generatedFrom: { seating: 'Seating chart sign.csv (Aug 1 2026)', invites: 'Invite list (1).csv (Jul 19 2026)' },
  /** Rows on the seating chart. */
  totalSeated: guests.length,
  /** Distinct human beings, as best we can tell. */
  uniquePeople: nameCounts.size,
  duplicateNames,
  tableCount: new Set(guests.map((g) => g.table)).size,
  inferredCount,
  groups,
  guests: guests.slice().sort((a, b) => a.name.localeCompare(b.name, 'en')),
}

mkdirSync(join(ROOT, 'data'), { recursive: true })
writeFileSync(join(ROOT, 'data', 'guests.json'), JSON.stringify(out, null, 2) + '\n')

console.log(`${out.totalSeated} seats · ${out.uniquePeople} unique · ${out.tableCount} tables · ${inferredCount} inferred`)
for (const g of groups) console.log(`  ${String(g.count).padStart(3)}  ${g.label}`)
