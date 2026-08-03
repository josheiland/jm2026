'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Status = 'queued' | 'uploading' | 'done' | 'error'

interface Item {
  id: string
  file: File
  status: Status
  progress: number
  error?: string
}

const MAX_PARALLEL = 2
const RETRIES = 4

const prettyBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Upload state as Google sees it. On a phone the connection drops mid-transfer
 * constantly, and the bytes often arrive fine while the *response* does not, so the
 * only safe thing to do after any failure is ask rather than assume.
 */
type RemoteState = { state: 'done' } | { state: 'incomplete'; offset: number } | { state: 'gone' }

/** "How much of this file do you already have?" Costs one request, saves a duplicate. */
function queryStatus(url: string, size: number) {
  return new Promise<RemoteState>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Range', `bytes */${size}`)
    xhr.onload = () => {
      // 200/201 means the file is already fully stored. Sending it again is exactly
      // what produced three copies of the same photo.
      if (xhr.status === 200 || xhr.status === 201) return resolve({ state: 'done' })
      if (xhr.status === 308) {
        // "bytes=0-262143" -> resume at 262144. Absent means nothing landed yet.
        const range = xhr.getResponseHeader('Range')
        const end = range ? Number(range.split('-')[1]) : NaN
        return resolve({ state: 'incomplete', offset: Number.isFinite(end) ? end + 1 : 0 })
      }
      if (xhr.status === 404 || xhr.status === 410) return resolve({ state: 'gone' })
      reject(new Error(`Could not check upload (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Connection dropped'))
    xhr.send()
  })
}

/**
 * Chunk size. Google requires a multiple of 256 KiB for any non-final chunk;
 * 4 MiB is 16 of them.
 *
 * Sending the file in chunks is what makes the progress bar honest. `upload.onprogress`
 * counts bytes handed to the OS socket buffer, not bytes the server has stored, and a
 * phone buffers aggressively enough to report 80% while Google holds 15%. Every chunk
 * ends with Google stating exactly how much it has, so the bar can be driven by that
 * instead of by the browser's optimism, and an interruption costs at most one chunk.
 */
const CHUNK = 4 * 1024 * 1024

/**
 * Send one chunk. Resolves with how many bytes Google has confirmed it holds, which is
 * authoritative, rather than with how many we believe we sent.
 */
function putChunk(
  url: string,
  file: File,
  start: number,
  end: number,
  onSent: (bytesInChunk: number) => void,
) {
  return new Promise<{ done: boolean; committed: number }>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${file.size}`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onSent(e.loaded)
    }
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        return resolve({ done: true, committed: file.size })
      }
      if (xhr.status === 308) {
        const range = xhr.getResponseHeader('Range')
        const last = range ? Number(range.split('-')[1]) : NaN
        // No Range header means Google kept nothing from this chunk.
        return resolve({ done: false, committed: Number.isFinite(last) ? last + 1 : start })
      }
      reject(new Error(`Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Connection dropped'))
    xhr.onabort = () => reject(new Error('Upload cancelled'))
    xhr.send(file.slice(start, end))
  })
}

export default function Uploader({ enabled }: { enabled: boolean }) {
  const [items, setItems] = useState<Item[]>([])
  const [uploader, setUploader] = useState('')
  const [note, setNote] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const running = useRef(0)
  const queue = useRef<Item[]>([])
  const seen = useRef(new Set<string>())

  // Guests upload in several bursts over a weekend — don't make them retype their name.
  useEffect(() => {
    setUploader(localStorage.getItem('mj-uploader-name') ?? '')
  }, [])
  useEffect(() => {
    if (uploader) localStorage.setItem('mj-uploader-name', uploader)
  }, [uploader])

  const update = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }, [])

  const pump = useCallback(async () => {
    while (running.current < MAX_PARALLEL && queue.current.length) {
      const item = queue.current.shift()!
      running.current++
      void (async () => {
        update(item.id, { status: 'uploading', progress: 0 })

        /**
         * Progress never goes backwards. Within a chunk the browser's byte count can
         * still run ahead of the server, so a resume can legitimately correct downward
         * by up to one chunk. Showing that correction reads as a bug, and holding the
         * higher number overstates by at most 4 MB, so the bar holds.
         */
        let shown = 0
        const report = (bytes: number) => {
          const pct = Math.min(100, Math.round((bytes / item.file.size) * 100))
          if (pct > shown) {
            shown = pct
            update(item.id, { progress: pct })
          }
        }

        // Every filename this file has been offered under. A retry that mints a new
        // session gets a new name, and the copy that actually landed may be under
        // any of them, so verification checks all of them.
        const names: string[] = []

        const mint = async () => {
          const res = await fetch('/api/upload/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.file.name,
              mimeType: item.file.type || 'application/octet-stream',
              size: item.file.size,
              uploader: localStorage.getItem('mj-uploader-name') ?? '',
              note: sessionStorage.getItem('mj-uploader-note') ?? '',
            }),
          })
          const data = (await res.json()) as {
            uploadUrl?: string
            filename?: string
            error?: string
          }
          if (!res.ok || !data.uploadUrl) throw new Error(data.error ?? 'Could not start upload')
          if (data.filename) names.push(data.filename)
          return data.uploadUrl
        }

        /**
         * The authoritative answer. Asks our own server whether the file is in the
         * album, which no amount of client-side network trouble can distort.
         */
        const verify = async () => {
          if (!names.length) return false
          for (let i = 0; i < 3; i++) {
            try {
              const res = await fetch('/api/upload/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names, size: item.file.size }),
              })
              if (res.ok) {
                const { found } = (await res.json()) as { found: boolean }
                if (found) return true
              }
            } catch {
              /* fall through to the retry */
            }
            await sleep(1200 * (i + 1))
          }
          return false
        }

        /**
         * One session per file, reused across every retry. The previous version opened
         * a fresh session each attempt, so a dropped response on a phone produced a
         * second complete copy in Drive rather than a resumed upload.
         */
        let error = ''
        try {
          let url = await mint()
          let offset = 0
          let confirmed = false
          let lastError: Error | null = null

          /** Reconciling is itself a network call, and the network is why we are here. */
          const reconcile = async (): Promise<RemoteState | null> => {
            for (let i = 0; i < 3; i++) {
              try {
                return await queryStatus(url, item.file.size)
              } catch {
                await sleep(700 * (i + 1))
              }
            }
            return null
          }

          // Retries are counted against consecutive failures, not against chunks: a
          // long video is many chunks and each successful one is real progress.
          let strikes = 0

          while (!confirmed && strikes <= RETRIES) {
            try {
              const end = Math.min(offset + CHUNK, item.file.size)
              const { done, committed } = await putChunk(url, item.file, offset, end, (sent) =>
                report(offset + sent),
              )

              if (done) {
                report(item.file.size)
                confirmed = true
                break
              }

              // Google's own count, which is the only one worth believing.
              if (committed > offset) {
                offset = committed
                report(offset)
                strikes = 0
                continue
              }
              // It kept nothing from that chunk. Treat as a failed attempt.
              strikes++
            } catch (err) {
              lastError = err as Error
              strikes++
            }

            // Reached after any failure. Never resend blind.
            const status = await reconcile()
            if (status?.state === 'done') {
              confirmed = true
              break
            }
            if (status?.state === 'gone') {
              // Session consumed or expired. Before starting a second copy, check
              // whether the first one is already sitting in the album.
              if (await verify()) {
                confirmed = true
                break
              }
              url = await mint()
              offset = 0
            } else if (status?.state === 'incomplete') {
              offset = status.offset
              report(offset)
            }
            // status null: server unreachable. Keep the offset and back off.

            if (strikes <= RETRIES) await sleep(Math.min(8000, 800 * 2 ** strikes))
          }

          // Nothing is reported to the guest until Drive itself confirms the file is
          // there. That makes "uploaded" mean uploaded, and stops a lost response from
          // being shown as a failure.
          if (!confirmed) confirmed = await verify()

          if (!confirmed) {
            throw lastError ?? new Error('Upload did not finish. Please try again.')
          }
          update(item.id, { status: 'done', progress: 100 })
        } catch (err) {
          error = (err as Error).message
        }

        if (error) update(item.id, { status: 'error', error })
        running.current--
        void pump()
      })()
    }
  }, [update])

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const accepted: Item[] = []
      const rejected: Item[] = []

      for (const file of Array.from(files)) {
        const id = `${file.name}-${file.size}-${file.lastModified}`
        // Picking the same photo twice is easy to do on a phone. Silently ignore it
        // rather than sending it again.
        if (seen.current.has(id)) continue
        seen.current.add(id)

        const isMedia =
          /^(image|video)\//.test(file.type) || /\.(heic|heif|mov|mp4|jpe?g|png|gif|webp)$/i.test(file.name)
        if (!isMedia) {
          rejected.push({ id, file, status: 'error', progress: 0, error: 'Photos and videos only' })
        } else {
          accepted.push({ id, file, status: 'queued', progress: 0 })
        }
      }

      if (!accepted.length && !rejected.length) return
      setItems((prev) => [...prev, ...accepted, ...rejected])
      queue.current.push(...accepted)
      void pump()
    },
    [pump],
  )

  useEffect(() => {
    sessionStorage.setItem('mj-uploader-note', note)
  }, [note])

  const done = items.filter((i) => i.status === 'done').length
  const failed = items.filter((i) => i.status === 'error')
  const active = items.some((i) => i.status === 'uploading' || i.status === 'queued')

  if (!enabled) {
    return (
      <div className="card p-8 md:p-10 text-center">
        <p className="display text-2xl">Nearly ready</p>
        <p className="mt-3 text-ink/65 max-w-md mx-auto">
          The photo drop is being switched on. It will be live well before the weekend.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Who is this from — asked before the files, so it's filled in by the time they land */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <label className="block">
          <span className="eyebrow">Your name (optional)</span>
          <input
            type="text"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            placeholder="So we know who to thank"
            autoComplete="name"
            className="mt-2 w-full bg-cream-soft border border-wine/15 px-4 py-3 text-ink placeholder:text-ink/55 focus:border-wine outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="eyebrow">A note (also optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="“the first dance, from table 9”"
            className="mt-2 w-full bg-cream-soft border border-wine/15 px-4 py-3 text-ink placeholder:text-ink/55 focus:border-wine outline-none transition-colors"
          />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
        }}
        className={`relative border border-dashed transition-colors ${
          dragging ? 'border-wine bg-blush/25' : 'border-wine/30 bg-cream-soft'
        }`}
      >
        <div className="px-6 py-14 text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="mx-auto text-wine/40"
            aria-hidden="true"
          >
            <path
              d="M20 27V9m0 0-7 7m7-7 7 7M6 25v4a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4v-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="display text-2xl mt-5">Drop them here</p>
          <p className="mt-2 text-sm text-ink/70 max-w-sm mx-auto">
            Photos and video, as many as you would like to share.
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 bg-wine text-cream px-7 py-3.5 text-sm uppercase tracking-[0.14em] hover:bg-wine-deep transition-colors"
          >
            Choose from your phone
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      {/* Progress list */}
      {items.length > 0 && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">
              {done} of {items.length} uploaded
            </p>
            {!active && done > 0 && (
              <p className="text-sm text-sage font-medium">
                {done === 1 ? 'Confirmed in the album' : `All ${done} confirmed in the album`}
              </p>
            )}
          </div>

          <ul className="mt-4 space-y-2.5">
            {items.map((it) => (
              <li key={it.id} className="card px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{it.file.name}</p>
                    <p className="text-sm text-ink/70">{prettyBytes(it.file.size)}</p>
                  </div>
                  <div className="shrink-0 text-sm tabular-nums">
                    {it.status === 'done' && (
                      <span className="text-sage font-medium">✓ Uploaded</span>
                    )}
                    {it.status === 'uploading' && (
                      <span className="text-wine">{it.progress}%</span>
                    )}
                    {it.status === 'queued' && <span className="text-ink/70">waiting</span>}
                    {it.status === 'error' && <span className="text-wine">failed</span>}
                  </div>
                </div>

                {(it.status === 'uploading' || it.status === 'queued') && (
                  <div className="mt-2.5 h-0.5 bg-wine/10 overflow-hidden">
                    <div
                      className="h-full bg-wine transition-[width] duration-300"
                      style={{ width: `${it.progress}%` }}
                    />
                  </div>
                )}

                {it.status === 'error' && (
                  <p className="mt-1.5 text-sm text-wine/80">{it.error}</p>
                )}
              </li>
            ))}
          </ul>

          {failed.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const retry = failed.filter((f) => f.error !== 'Photos and videos only')
                setItems((prev) =>
                  prev.map((i) =>
                    retry.some((r) => r.id === i.id)
                      ? { ...i, status: 'queued' as Status, progress: 0, error: undefined }
                      : i,
                  ),
                )
                queue.current.push(...retry)
                void pump()
              }}
              className="mt-4 text-sm text-wine link-underline"
            >
              Try the failed ones again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
