import { m } from 'framer-motion'
import { useState, type KeyboardEvent } from 'react'
import { Img, type ImageKey } from '../components/Img'
import { useUi, type Seat } from '../state/ui'

type Part = 'front' | 'courtyard' | 'wing'

/* Facts and quotes from the Historic England listing (entry 1361048), Leicester City Council's
 * Market Place Conservation Area Character Appraisal (2007) and Visit Leicester. See intake/research.md. */
const parts: Record<
  Part,
  { tab: string; title: string; date: string; body: string; quote: { text: string; by: string }; photos: [ImageKey, ImageKey]; seat?: Seat; book: string }
> = {
  front: {
    tab: 'The front',
    title: 'The bar, in the Georgian front',
    date: '18th century',
    body: 'Painted brick, a steep slate roof and paired brackets under wide eaves, three storeys up from Silver Street. Through the yellow door, the bar front is a wall of lit yellow hexagons.',
    quote: { text: '“an 18th century brick building, although much altered, with a classical style stone doorcase”', by: 'Leicester City Council' },
    photos: ['bar-front', 'backbar'],
    book: 'Book a table',
  },
  courtyard: {
    tab: 'The courtyard',
    title: 'The courtyard, by day',
    date: 'Out the back',
    body: 'Between the front and the old wing: two palm trees, festoon lights, a globe lamp and lime-green chairs. A quick drink in the afternoon, right next to St Martin’s Square.',
    quote: { text: '“the perfect hideaway from the bustle of the city centre”', by: 'Visit Leicester' },
    photos: ['courtyard-day', 'courtyard-night'],
    seat: 'The courtyard',
    book: 'Book the courtyard',
  },
  wing: {
    tab: 'The rear wing',
    title: 'Upstairs, by evening',
    date: 'Probably 16th or 17th century',
    body: 'Much older than the front: timber-framed, with brick between the timbers. Upstairs the old curved beams are still on show, and dinner goes slower and candlelit.',
    quote: { text: '“arched brackets to curved tiebeam exposed in first floor room”', by: 'Historic England listing' },
    photos: ['upstairs', 'upstairs-room'],
    seat: 'Upstairs',
    book: 'Book upstairs',
  },
}
const order: Part[] = ['front', 'courtyard', 'wing']

export function House() {
  const [part, setPart] = useState<Part>('courtyard')
  const { openBooking } = useUi()
  const p = parts[part]

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = order[(order.indexOf(part) + step + order.length) % order.length]
    setPart(next)
    requestAnimationFrame(() => document.getElementById(`house-tab-${next}`)?.focus())
  }

  return (
    <section id="house" className="house section on-stone" aria-labelledby="house-title">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">The house</span>
          <h2 className="title" id="house-title">
            A Georgian front, and a much older house behind it
          </h2>
          <p className="lead">
            Listed Grade II since 1975 as “42 Silver Street including wing at rear”. The council reckons part of a 15th-century hall house
            survives back there.
          </p>
        </div>

        <figure className="house__drawing">
          <Section part={part} onPick={setPart} />
          <div className="house__tabs" role="tablist" aria-label="Parts of the building" onKeyDown={onKey}>
            {order.map((id) => (
              <button
                key={id}
                id={`house-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={part === id}
                aria-controls="house-panel"
                tabIndex={part === id ? 0 : -1}
                className={`house__tab house__tab--${id} ${part === id ? 'is-on' : ''}`}
                onClick={() => setPart(id)}
              >
                {parts[id].tab}
              </button>
            ))}
          </div>
        </figure>

        <m.div
          key={part}
          id="house-panel"
          role="tabpanel"
          aria-labelledby={`house-tab-${part}`}
          className="house__panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          <div className="house__text">
            <span className="eyebrow">{p.date}</span>
            <h3 className="subtitle">{p.title}</h3>
            <p>{p.body}</p>
            <blockquote className="quote">
              <p>{p.quote.text}</p>
              <cite>{p.quote.by}</cite>
            </blockquote>
            <button type="button" className="btn btn--black btn--small" onClick={() => openBooking({ seat: p.seat })}>
              {p.book}
            </button>
          </div>
          <div className="house__photos">
            <Img k={p.photos[0]} sizes="(min-width: 900px) 36vw, 60vw" className="house__photo" />
            <Img k={p.photos[1]} sizes="(min-width: 900px) 20vw, 36vw" className="house__photo house__photo--small" />
          </div>
        </m.div>

        <ol className="street" aria-label="Silver Street through time">
          <li>
            <span>Roman</span>The street follows roughly the line of Roman Leicester’s main east–west road.
          </li>
          <li>
            <span>to 1506</span>Known as the Sheepmarket, until the sheep market moves to the Saturday market.
          </li>
          <li>
            <span>1587</span>First written down as Silver Street, probably after the silversmiths who worked here.
          </li>
          <li>
            <span>1700s</span>No. 42’s brick front goes up, in front of the timber-framed wing.
          </li>
          <li>
            <span>2025</span>Hive &amp; Honey opens in April, in what was the Ask.
          </li>
        </ol>
      </div>
    </section>
  )
}

/*
 * A cutaway through the building from the side, street on the left:
 * the three-storey front with its gable, the courtyard, the two-storey rear wing.
 * Ground at y=420. The chosen part fills yellow.
 */
function Section({ part, onPick }: { part: Part; onPick: (p: Part) => void }) {
  const fill = (id: Part) => (part === id ? 'hs__fill is-on' : 'hs__fill')
  const bulbs = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10
    const x = 450 + 320 * t
    const y = 246 + 54 * t + 40 * Math.sin(Math.PI * t) // the sagging string
    return [x, y] as const
  })
  return (
    <svg className="hs" viewBox="0 0 1200 440" role="img" aria-label="Cutaway of 42 Silver Street from the side: the three-storey Georgian front on the street, the courtyard with two palm trees, and the older two-storey timber-framed wing at the back">
      {/* the three parts, as shapes you can pick */}
      <path className={fill('front')} d="M92 420 V152 H72 L270 38 L468 152 H450 V420 Z" onClick={() => onPick('front')} />
      <path
        className={fill('courtyard')}
        d={`M450 420 V246 ${bulbs.map(([x, y]) => `L${x.toFixed(0)} ${y.toFixed(0)}`).join(' ')} L770 300 V420 Z`}
        onClick={() => onPick('courtyard')}
      />
      <path className={fill('wing')} d="M770 420 V262 H752 L945 166 L1138 262 H1120 V420 Z" onClick={() => onPick('wing')} />

      <g className="hs__ink">
        {/* ground */}
        <path d="M30 420 H1170" />

        {/* ---- the front ---- */}
        <path d="M92 420 V152 M450 420 V152 M72 152 L270 38 L468 152 Z" />
        <path d="M76 152 v10 h8 v-10 M88 152 v10 h8 v-10 M444 152 v10 h8 v-10 M456 152 v10 h8 v-10" className="hs__fine" />
        <path d="M92 300 H450 M92 226 H450" className="hs__fine" />
        {/* windows in the street wall, and the shop window with its awning */}
        <path d="M86 168 h12 v44 h-12 Z M86 240 h12 v46 h-12 Z M86 318 h12 v86 h-12 Z" className="hs__window" />
        <path d="M92 312 L58 326 V334 L92 320 Z" className="hs__yellow" />
        {/* inside: the bar, stools, pendant lights */}
        <path d="M300 420 V376 H438 V420 M294 376 H444" />
        <path d="M250 420 V386 M240 386 H260 M210 420 V386 M200 386 H220" className="hs__fine" />
        <path d="M330 300 V330 M370 300 V330 M410 300 V330" className="hs__fine" />
        <circle cx="330" cy="334" r="4" className="hs__bulb" />
        <circle cx="370" cy="334" r="4" className="hs__bulb" />
        <circle cx="410" cy="334" r="4" className="hs__bulb" />
        <path d="M150 420 V384 h30 V420" className="hs__fine" />

        {/* ---- the courtyard ---- */}
        <path d="M528 420 C 532 380 538 330 548 276" />
        <path d="M600 420 C 598 372 596 318 590 258" />
        <g className="hs__frond">
          <path d="M548 276 q-34 -6 -58 18 M548 276 q-16 -30 -48 -34 M548 276 q10 -32 46 -36 M548 276 q34 -2 54 24 M548 276 q-4 22 -24 40 M548 276 q14 18 16 42" />
          <path d="M590 258 q-34 -6 -58 18 M590 258 q-16 -30 -48 -34 M590 258 q10 -32 46 -36 M590 258 q34 -2 54 24 M590 258 q-4 22 -24 40 M590 258 q14 18 16 42" />
        </g>
        <path d={`M450 246 ${bulbs.map(([x, y]) => `L${x.toFixed(0)} ${y.toFixed(0)}`).join(' ')} L770 300`} className="hs__fine" />
        {bulbs.map(([x, y]) => (
          <circle key={x} cx={x} cy={y + 5} r="3.2" className="hs__bulb" />
        ))}
        <path d="M740 420 V352" />
        <circle cx="740" cy="344" r="9" className="hs__glow" />
        <circle cx="725" cy="352" r="6" className="hs__glow" />
        <circle cx="755" cy="352" r="6" className="hs__glow" />
        <path d="M650 420 V392 M630 388 H670" />
        <path d="M618 420 V398 h-10 V376 M682 420 V398 h10 V376" className="hs__chair" />

        {/* ---- the rear wing ---- */}
        <path d="M770 420 V262 M1120 420 V262 M752 262 L945 166 L1138 262 Z" />
        <path d="M770 340 H1120" className="hs__fine" />
        {/* timber frame and brick nogging below */}
        <path d="M828 420 V340 M886 420 V340 M944 420 V340 M1002 420 V340 M1060 420 V340" className="hs__fine" />
        <path d="M770 380 H1120" className="hs__fine" />
        <path d="M770 380 L828 340 M886 340 L944 380 M1002 380 L1060 340" className="hs__fine" />
        {/* upstairs: the cambered tie-beam on its arched braces, still on show */}
        <path d="M772 268 Q945 254 1118 268" className="hs__beam" />
        <path d="M772 318 Q774 280 822 266 M1118 318 Q1116 280 1068 266" className="hs__beam" />
        <path d="M945 170 V262" className="hs__fine" />
        {/* dinner by candlelight */}
        <path d="M900 340 V318 M990 340 V318 M890 316 H1000" />
        <path d="M870 340 V322 h-10 V300 M1020 340 V322 h10 V300" className="hs__fine" />
        <path d="M932 316 v-12 M958 316 v-12" className="hs__fine" />
        <circle cx="932" cy="300" r="3" className="hs__flame" />
        <circle cx="958" cy="300" r="3" className="hs__flame" />
      </g>

      <text x="30" y="438" className="hs__street">
        SILVER STREET
      </text>
    </svg>
  )
}
