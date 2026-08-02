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

/** Send from `offset` to the end. Resolves done:false if Google wants more. */
function putFrom(
  url: string,
  file: File,
  offset: number,
  onProgress: (frac: number) => void,
) {
  return new Promise<{ done: boolean }>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    if (offset > 0) {
      xhr.setRequestHeader('Content-Range', `bytes ${offset}-${file.size - 1}/${file.size}`)
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((offset + e.loaded) / file.size)
    }
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) return resolve({ done: true })
      if (xhr.status === 308) return resolve({ done: false })
      reject(new Error(`Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Connection dropped'))
    xhr.onabort = () => reject(new Error('Upload cancelled'))
    xhr.send(offset > 0 ? file.slice(offset) : file)
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
        const onProgress = (frac: number) =>
          update(item.id, { progress: Math.min(100, Math.round(frac * 100)) })

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
          const data = (await res.json()) as { uploadUrl?: string; error?: string }
          if (!res.ok || !data.uploadUrl) throw new Error(data.error ?? 'Could not start upload')
          return data.uploadUrl
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
          let failure: Error | null = null

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

          for (let attempt = 0; attempt <= RETRIES; attempt++) {
            failure = null
            try {
              const { done } = await putFrom(url, item.file, offset, onProgress)
              if (done) break
            } catch (err) {
              failure = err as Error
            }

            // Reached after a 308 and after any failure. Never resend blind.
            const status = await reconcile()
            if (status?.state === 'done') {
              failure = null
              break
            }
            if (status?.state === 'gone') {
              url = await mint()
              offset = 0
            } else if (status?.state === 'incomplete') {
              offset = status.offset
              failure = null
            }
            // status null: server unreachable. Keep the offset and back off.

            if (attempt < RETRIES) await sleep(Math.min(8000, 800 * 2 ** attempt))
          }

          // Last word before calling it failed. The bytes very often did arrive and it
          // was only the response that got lost, and a phone in a field recovers slowly.
          if (failure) {
            await sleep(2500)
            const final = await reconcile()
            if (final?.state === 'done') failure = null
          }

          if (failure) throw failure
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
          The photo drop is being switched on. It will be live well before the weekend, with
          nothing for you to install, and no account to make.
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
            className="mt-2 w-full bg-cream-soft border border-wine/15 px-4 py-3 text-ink placeholder:text-ink/35 focus:border-wine outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="eyebrow">A note (also optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="“the first dance, from table 9”"
            className="mt-2 w-full bg-cream-soft border border-wine/15 px-4 py-3 text-ink placeholder:text-ink/35 focus:border-wine outline-none transition-colors"
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
          <p className="mt-2 text-sm text-ink/55 max-w-sm mx-auto">
            Photos and video, as many as you like. Live Photos and iPhone HEIC are fine.
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
            accept="image/*,video/*,.heic,.heif,.mov"
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
              <p className="text-sm text-sage">Safely in the album. Thank you.</p>
            )}
          </div>

          <ul className="mt-4 space-y-2.5">
            {items.map((it) => (
              <li key={it.id} className="card px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{it.file.name}</p>
                    <p className="text-xs text-ink/45">{prettyBytes(it.file.size)}</p>
                  </div>
                  <div className="shrink-0 text-sm tabular-nums">
                    {it.status === 'done' && <span className="text-sage">✓</span>}
                    {it.status === 'uploading' && (
                      <span className="text-wine">{it.progress}%</span>
                    )}
                    {it.status === 'queued' && <span className="text-ink/35">waiting</span>}
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
                  <p className="mt-1.5 text-xs text-wine/80">{it.error}</p>
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
