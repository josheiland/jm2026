// Runtime configuration. Everything here is optional — the site renders a sensible
// "not set up yet" state for anything missing rather than breaking.

/** WhatsApp group invite, e.g. https://chat.whatsapp.com/XXXXXXXX */
export const WHATSAPP_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? ''

/** Set once Google Drive credentials are in place; flips the upload page live. */
export const UPLOADS_ENABLED =
  process.env.NEXT_PUBLIC_UPLOADS_ENABLED === '1' ||
  (!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_REFRESH_TOKEN)

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB — covers phone video

export const ACCEPTED_MIME = ['image/', 'video/']
