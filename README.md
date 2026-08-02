# Mary & Josh — September 5–7, 2026

The guest companion site for the wedding weekend in Charlottesville.
Live at **https://eilands2026.vercel.app**

The [Zola site](https://www.zola.com/wedding/eilands2026) stays the front door — RSVPs and the
registry live there. This is the thing guests actually open *during* the weekend: schedule with
shuttle times, the photo drop, the guest list, and the FAQs.

---

## Status

Everything is live and configured: Drive uploads, the WhatsApp group link, photos, guest list.

Health check, worth running the week of the wedding:

```bash
curl https://eilands2026.vercel.app/api/upload/health
# {"ok":true,"configured":true,"files":0}
```

If it ever returns `ok: false`, the refresh token has died — see below.

---

## Re-doing the Drive setup

Only needed if the token is revoked or the album folder moves:

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

Then redeploy — `vercel deploy --prod` — and re-check `/api/upload/health`.

### Environment variables

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth client for the Drive upload |
| `GOOGLE_REFRESH_TOKEN` | Long-lived grant; dies after 7 days if the consent screen is in "Testing" |
| `GOOGLE_DRIVE_FOLDER_ID` | The album folder photos land in |
| `NEXT_PUBLIC_WHATSAPP_INVITE` | WhatsApp group invite link |

`NEXT_PUBLIC_*` values are inlined at **build** time, so changing one needs a redeploy, not just
an env edit. The rest are read at request time.

Every one is optional in the sense that the site degrades rather than breaks: no Google config
gives a "nearly ready" upload page, no WhatsApp link gives a "coming soon" button.

### Debugging OAuth

`redirect_uri_mismatch` is the same error string for several unrelated causes, including one that
is not your fault: Google's edge cache can take minutes to pick up a Console change, so a correct
fix can keep failing for a while. To find out what Google actually has registered:

```bash
node scripts/diagnose-oauth.mjs <client-id>
```

It probes candidate redirect URIs against the `/authorize` endpoint — which validates before any
sign-in and encodes the reason in a base64 `authError` param — and reports which are registered.
Generic; works for any Google project.

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

`data/guests.json` is generated, not hand-edited. Edit the sheet, then:

```bash
npm run guests
```

It reads the **"Invite list" tab** of the wedding spreadsheet live, so whatever is in the sheet is
what ships. One row per person, carrying both the table and the category.

| Table value | Meaning |
|---|---|
| `1`–`17` | Reception tables |
| `H` | Head table — the wedding party, their significant others, and the couple |
| `--` | Not attending; dropped |

Current totals: **180 seated, 178 guests** (excluding Mary and Josh), **18 tables**, 29 at the
head table.

Head-table members are marked with a ◆ inside their own affinity group rather than pulled into a
separate section, so each group stays complete and nobody is listed twice. The by-table view
leads with a full-width Head Table card.

The sheet must stay shared as "anyone with the link can view" for the script to read it. If the
`Table`/`Name`/`Type` columns are renamed the script fails loudly rather than silently producing
a short list.

**Privacy:** the source has `Email` and `Address` columns for all 236 people. Neither is read,
and the raw CSV is never written to disk — only the sanitised JSON, which holds nothing but name,
table and category.

### Duplicate names

`Bill Blankemeier` appears twice, at Tables 1 and 2. Confirmed as two different people, so he is
in `KNOWN_DISTINCT` and both seats count. Any *other* repeated name lands in `suspectDuplicates`,
is deducted from the total, and is printed as a warning — a duplicated row can never silently
inflate the count.

---

## Photos

`public/photos/` and `lib/photos.ts` are generated from the couple's own Zola gallery:

```bash
python3 scripts/build-photos.py          # rebuild the nine placed photos
python3 scripts/build-photos.py --list   # print every image URL in the gallery
```

Zola renders its gallery client-side, but the image URLs are in the server HTML as
`https://images.zola.com/<uuid>`; `?w=2000` returns the original (~1680px). `scripts/photos.json`
pins the nine by UUID with a target width and alt text, so a re-run is reproducible even if the
gallery is reordered.

Each image is resized, compressed to quality 82 progressive JPEG, and given a 16px blurred
placeholder inlined as a data URL — no layout shift, no grey boxes on hotel wifi. Nine photos,
2.7 MB total.

To swap one: run `--list`, pick a URL, update the UUID in `scripts/photos.json`, re-run.

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
  guests/             178 guests, searchable, by group or by table
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
  photos.ts           generated image manifest with blur placeholders
scripts/
  build-guests.mjs    live Google Sheet -> data/guests.json
  build-photos.py     Zola gallery -> public/photos + lib/photos.ts
  photos.json         the nine photos, pinned by UUID
  google-auth.mjs     one-time Drive setup + live test
  diagnose-oauth.mjs  works out which redirect URIs a client has registered
```

### Design

Palette and type are borrowed from the Zola site rather than invented, so the two read as one
family: `#63494A` wine on `#F5EFE8` cream.

Three faces, each with a job:

| Token | Face | Used for |
|---|---|---|
| `--font-display` | Bodoni Moda | Names and headings |
| `--font-body` | Cormorant Garamond | Anything you read a sentence of |
| `--font-ui` | Jost | Eyebrows, buttons, nav, inputs |

Cormorant is beautiful in a paragraph and unreadable at 11px with 0.24em tracking, so small
wayfinding text is pinned to the sans in a base rule rather than left to inherit. Cormorant also
runs small, so the base size is 1.25rem rather than the 1.0625rem a sans would take.

Zola sets its headings in **Sauvage**, a commercial face served under their Adobe licence. It is
not on Adobe Fonts and there is no free source, so matching it exactly is not possible and the
site uses Bodoni Moda instead. Four alternative body fonts are previewed at `/styles`; switching
is one line in `globals.css`.

`.display-sentence` is the display face with looser leading, for display-sized text that is an
actual sentence rather than a heading.

Photos come from the Zola gallery — see the Photos section above. The hero band, story beats,
Charlottesville card, schedule and thank-you page each carry one; the rest of the gallery is
available via `--list` if you want more.

### Timezone

Every event time carries an explicit `-04:00`. Charlottesville is on EDT for the whole weekend
(US DST 2026 runs March 8 – November 1), so the offset is constant and no timezone library is
needed. This is what keeps the countdown and the "happening now" banner correct for a guest
sitting in California or Kigali rather than Virginia.
