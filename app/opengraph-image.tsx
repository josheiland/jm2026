import { ImageResponse } from 'next/og'

// The link gets pasted into a WhatsApp group of 180 people. Without this it previews
// as a bare URL with no title and no image, which is the first impression a good
// number of guests will get of the site.

export const alt = 'Mary & Josh — September 6, 2026 — Hazy Mountain Vineyards, Afton, Virginia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CORMORANT_400 =
  'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf'

export default async function Image() {
  const cormorant = await fetch(CORMORANT_400).then((r) => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5efe8',
          fontFamily: 'Cormorant',
          color: '#43302f',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: 'uppercase',
            color: '#7c615f',
            marginBottom: 28,
          }}
        >
          In celebration of
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <span style={{ fontSize: 132, lineHeight: 1 }}>Mary</span>
          <span style={{ fontSize: 96, lineHeight: 1, color: '#63494a' }}>&amp;</span>
          <span style={{ fontSize: 132, lineHeight: 1 }}>Josh</span>
        </div>

        <div
          style={{
            width: 220,
            height: 1,
            background: '#63494a',
            opacity: 0.35,
            margin: '40px 0 34px',
          }}
        />

        <div style={{ fontSize: 34, color: '#2b2321' }}>Sunday, September 6, 2026</div>
        <div style={{ fontSize: 27, color: '#7c615f', marginTop: 10 }}>
          Hazy Mountain Vineyards · Afton, Virginia
        </div>

        {/* The Blue Ridge, same silhouette as the site footer. */}
        <svg
          width="1200"
          height="120"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        >
          <path
            d="M0 120 V78 L120 58 L245 74 L390 40 L520 66 L640 34 L780 62 L900 44 L1040 70 L1180 48 L1310 68 L1440 52 V120 Z"
            fill="#63494a"
            opacity="0.22"
          />
          <path
            d="M0 120 V92 L140 74 L280 90 L420 62 L560 84 L700 58 L840 82 L980 66 L1120 88 L1270 70 L1440 86 V120 Z"
            fill="#63494a"
            opacity="0.4"
          />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Cormorant', data: cormorant, style: 'normal', weight: 400 }],
    },
  )
}
