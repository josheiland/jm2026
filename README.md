# Mary & Josh — September 5–7, 2026

The guest companion site for the wedding weekend in Charlottesville.
Live at **https://eilands2026.vercel.app**

The [Zola site](https://www.zola.com/wedding/eilands2026) stays the front door — RSVPs and the
registry live there. This is the thing guests actually open *during* the weekend: schedule with
shuttle times, the photo drop, the guest list, and the FAQs.

---

## The one thing that still needs you

**Photo uploads are switched off until Google Drive credentials exist.** Everything else on the
site is live. The upload page currently shows a polite "nearly ready" state instead of a broken
uploader.

To turn it on:

```bash
npm run google-auth
```

It walks you through creating an OAuth client (about five minutes in the Google Cloud Console),
does the consent flow in your browser, creates the album folder in
`josheiland17@gmail.com`'s Drive, **performs a real test upload and deletes it**, then prints the
four environment variables to paste into Vercel.

> Pick **Desktop app** as the application type, not Web application. Desktop clients have
> loopback redirects (`http://127.0.0.1:<port>`) accepted automatically, so there is no redirect
> URI to register and `redirect_uri_mismatch` cannot happen.

> ⚠️ On the OAuth consent screen, click **Publish app**. If the project is left in "Testing",
> Google silently expires the refresh token after 7 days and the portal dies mid-weekend. The
> scope used (`drive.file`) is non-sensitive, so publishing needs no review from Google.

Then redeploy and confirm:

```bash
curl https://eilands2026.vercel.app/api/upload/health
# {"ok":true,"configured":true,"files":0}
```

### The other env var

```
NEXT_PUBLIC_WHATSAPP_INVITE=https://chat.whatsapp.com/XXXXXXXXXXXX
```

Get it from WhatsApp → group → Invite via link. Until it is set, every WhatsApp button renders a
"link coming soon" state rather than a dead link.

---

## About reminders

**Automated WhatsApp group reminders are not possible.** Meta's WhatsApp Business API only
supports 1:1 conversations with users who have opted in, using pre-approved message templates —
it has no group-messaging capability at all. The libraries that claim otherwise drive a
headless WhatsApp Web session, which violates the terms of service and risks the number being
banned. Not a thing to gamble on five weeks before a wedding.

What the site does instead, which actually reaches a guest's phone:

- **Calendar files with alarms baked in.** Every event has an "Add to calendar" link serving an
  `.ics` with a `VALARM` trigger — one hour before most things, two hours before the ceremony.
  The guest's own phone fires the reminder. No app, no opt-in, no API.
- **A "happening now / up next" banner** that appears automatically on the homepage from the
  evening of September 4 through the end of Monday. When the next thing is a shuttle within 90
  minutes, the whole banner goes wine-coloured and says so.

For actual WhatsApp nudges, send them by hand from the group — it takes ten seconds and reads
better coming from you anyway.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Updating the guest list

`data/guests.json` is generated, not hand-edited:

```bash
npm run guests   # reads the two CSVs in ~/Downloads
```

Sources:

| File | Role |
|---|---|
| `Josh + Mary wedding - Seating chart sign.csv` | Authoritative — who is seated and at which table |
| `Josh + Mary wedding invites - Invite list (1).csv` | Supplies the "how do we know them" category |

Plus-ones appear on the seating chart but not the invite list. Since tables are seated by
affinity group, an unmatched guest inherits their table's dominant group and is flagged
`inferred: true` in the JSON. 17 of the 151 are inferred this way.

**Emails, phone numbers and home addresses are in the source spreadsheets and are deliberately
never written to `guests.json`.** The site is public.

### Known data issue

`Bill Blankemeier` appears twice on the seating chart — Table 1 and Table 2 — so the chart has
151 seats but 150 distinct names. This may be two generations sharing a name (the chart does
list `Terry Moore IV` and `Terry Moore V` at Table 8) or a duplicate row. The site reports
**150 people** and lists both entries. If they are two different Bills, disambiguate them in the
CSV and re-run `npm run guests`; the count corrects itself everywhere, including the thank-you
note.

---

## How the photo upload works

Guests upload multi-gigabyte phone video from a vineyard with patchy signal. That constrains the
design more than it might look:

1. Browser asks `POST /api/upload/session` for permission to upload one file.
2. The server refreshes its Google access token, opens a **resumable upload session** against the
   Drive API, and returns only the session URI.
3. The browser `PUT`s the bytes **straight to Google**, with progress from `XMLHttpRequest`.

Why not just post the file to the server? Vercel caps function request bodies at 4.5 MB. A single
phone video is far larger, so the bytes cannot pass through the function at all.

Why is this safe? The browser never receives a Google token. The session URI is a capability URL
authorising exactly one upload of one file. Google sets `access-control-allow-origin` on the
upload host (verified against this origin), so the direct `PUT` works with no credentials
attached. The OAuth scope is `drive.file`, which grants access only to files this app created —
it cannot read anything else in the account.

Uploads land in one folder, named
`2026-09-06_1934__Jane-Doe__IMG_1234.jpg`, so the folder sorts chronologically and every file
carries its sender. The uploader's name and optional note also go into the Drive file
description.

---

## Structure

```
app/
  page.tsx            hero, countdown, day-at-a-glance, story, quick links
  schedule/           three-day timeline + the full dinner menu
  travel/             shuttles, hotels, airports, parking
  guests/             151 guests, searchable, by group or by table
  photos/             the upload portal
  faq/                searchable accordion
  charlottesville/    their actual recommendations
  thank-you/          the note
  api/ics/            calendar files with alarms
  api/upload/         session minting + health check
lib/
  events.ts           every event, times pinned to -04:00 (EDT all weekend)
  content.ts          travel, hotels, FAQs, menu, story, thank-you copy
  drive.ts            Google Drive, server half
  ics.ts              RFC 5545 generation
scripts/
  build-guests.mjs    CSV -> data/guests.json
  google-auth.mjs     one-time Drive setup + live test
```

### Design

Palette and type are deliberately borrowed rather than invented. `#63494A` (wine) and `#F5EFE8`
(cream) are lifted from the Zola site so the two feel like one family. The type pairing —
Bodoni Moda with Pinyon Script — is what the printed signage spec
(`Family/wedding-signage/canva-build-spec.md`) already names as the web stand-ins for Perfectly
Nineties and Antura Script, so the site matches the physical pieces at the venue.

There are no photographs yet. The layout is built to take them: the hero, the story section, and
the Charlottesville cards all have room. Drop images into `public/` and they can go in whenever
you have them.

### Timezone

Every event time carries an explicit `-04:00`. Charlottesville is on EDT for the whole weekend
(US DST 2026 runs March 8 – November 1), so the offset is constant and no timezone library is
needed. This is what keeps the countdown and the "happening now" banner correct for a guest
sitting in California or Kigali rather than Virginia.
