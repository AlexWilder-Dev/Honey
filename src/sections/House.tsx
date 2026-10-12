import { AnimatePresence, m } from 'framer-motion'
import { useState, type KeyboardEvent } from 'react'
import { Img, type ImageKey } from '../components/Img'
import { pour } from '../lib/motion'
import { useUi, type Seat } from '../state/ui'

type Part = 'front' | 'courtyard' | 'wing'

/* Facts and quotes from the Historic England listing (entry 1361048), Leicester City Council's
 * Market Place Conservation Area Character Appraisal (2007) and Visit Leicester. See intake/research.md. */
const parts: Record<
  Part,
  { n: number; tab: string; title: string; date: string; body: string; quote?: { text: string; by: string }; photos: [ImageKey, ImageKey]; seat?: Seat; book: string }
> = {
  front: {
    n: 1,
    tab: 'The front',
    title: 'The front',
    date: '18th century',
    body: 'Painted brick, a steep slate roof and paired brackets under wide eaves, three storeys up from Silver Street. The yellow door sits in a stone doorcase. Inside, the bar front is a wall of lit yellow hexagons.',
    quote: { text: '“an 18th century brick building, although much altered, with a classical style stone doorcase”', by: 'Leicester City Council conservation appraisal' },
    photos: ['bar-front', 'backbar'],
    book: 'Book a table',
  },
  courtyard: {
    n: 2,
    tab: 'The courtyard',
    title: 'The courtyard',
    date: 'Out the back',
    body: 'Between the front and the old wing: two palm trees, festoon lights, a globe lamp and lime-green chairs. Made for a quick drink in the afternoon, tucked away right next to St Martin’s Square.',
    quote: { text: '“the perfect hideaway from the bustle of the city centre”', by: 'Visit Leicester' },
    photos: ['courtyard-day', 'courtyard-night'],
    seat: 'The courtyard',
    book: 'Book the courtyard',
  },
  wing: {
    n: 3,
    tab: 'Upstairs, in the old wing',
    title: 'The rear wing',
    date: 'Probably 16th or 17th century',
    body: 'Far older than the front: timber-framed with brick between the timbers. Upstairs, the old curved beams are still on show, and that’s where dinner gets candlelit and slower in the evening.',
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
    <section id="house" className="house on-stone" aria-labelledby="house-title">
      <div className="wrap">
        <div className="house__head">
          <p className="dashed dashed--left">42 Silver Street</p>
          <h2 className="h-caps h-l" id="house-title">
            A Georgian front with a much older house behind it
          </h2>
          <p className="lead">
            Grade II listed since 14 March 1975, as “42 Silver Street including wing at rear”. The council reckons part of a 15th-century hall
            house survives back there.
          </p>
        </div>

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
              className={`house__tab ${part === id ? 'is-on' : ''}`}
              onClick={() => setPart(id)}
            >
              <span className="house__n">{parts[id].n}</span>
              {parts[id].tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={part}
            id="house-panel"
            role="tabpanel"
            aria-labelledby={`house-tab-${part}`}
            className="house__panel"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={pour}
          >
            <div className="house__text">
              <p className="house__date">{p.date}</p>
              <h3 className="h-caps h-m">{p.title}</h3>
              <p>{p.body}</p>
              {p.quote && (
                <blockquote className="house__quote">
                  <p>{p.quote.text}</p>
                  <cite>{p.quote.by}</cite>
                </blockquote>
              )}
              <button type="button" className="btn btn--black btn--small" onClick={() => openBooking({ seat: p.seat })}>
                {p.book}
              </button>
            </div>
            <div className="house__photos">
              <Img k={p.photos[0]} sizes="(min-width: 900px) 34vw, 60vw" className="house__photo" />
              <Img k={p.photos[1]} sizes="(min-width: 900px) 20vw, 36vw" className="house__photo house__photo--small" />
            </div>
          </m.div>
        </AnimatePresence>

        <ol className="street">
          <li>
            <span>Roman</span>Silver Street follows roughly the line of Roman Leicester’s main east–west street.
          </li>
          <li>
            <span>1506</span>Known as the Sheepmarket, until the sheep market moves out to the Saturday market.
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

/** Side-on section through the building: front, courtyard, rear wing. Each part is a button. */
function Section({ part, onPick }: { part: Part; onPick: (p: Part) => void }) {
  const zone = (id: Part, d: string) => (
    <path className={`hs__zone ${part === id ? 'is-on' : ''}`} d={d} onClick={() => onPick(id)} />
  )
  return (
    <svg className="hs" viewBox="0 0 1200 520" role="img" aria-label="A side-on drawing of 42 Silver Street: the three-storey 18th-century front on the street, the courtyard with two palm trees behind it, and the two-storey timber-framed rear wing">
      {/* highlight zones */}
      {zone('front', 'M96 172 L290 34 L484 172 L484 470 L96 470 Z')}
      {zone('courtyard', 'M484 250 L770 250 L770 470 L484 470 Z')}
      {zone('wing', 'M770 300 L948 196 L1126 300 L1126 470 L770 470 Z')}

      <g className="hs__line">
        {/* street and ground */}
        <path d="M0 470 H1200" />
        <path d="M0 478 H96" className="hs__thin" />

        {/* the front: three storeys, steep gabled roof, wide eaves on paired brackets */}
        <path d="M100 470 V172 H480 V470" />
        <path d="M76 176 L290 26 L504 176" />
        <path d="M100 376 H480 M100 272 H480" className="hs__thin" />
        <path d="M82 178 v14 h7 v-12 M91 178 v14 h7 v-12" className="hs__thin" />
        <path d="M498 178 v14 h-7 v-12 M489 178 v14 h-7 v-12" className="hs__thin" />
        {/* doorcase, awning and step on the street side */}
        <path d="M100 470 V398 H88 V470" className="hs__thin" />
        <path d="M84 396 H104" />
        <path d="M100 380 L74 388 V394 L100 386" className="hs__awning" />
        {/* the bar counter and stools */}
        <path d="M300 470 V436 H430 V470" className="hs__thin" />
        <path d="M310 432 H420" />
        <path d="M282 470 V446 M276 446 H290 M452 470 V446 M446 446 H460" className="hs__thin" />
        {/* sash windows above */}
        <path d="M170 300 h46 v52 h-46 z M300 300 h46 v52 h-46 z M410 300 h46 v52 h-46 z" className="hs__thin" />
        <path d="M170 198 h46 v52 h-46 z M300 198 h46 v52 h-46 z M410 198 h46 v52 h-46 z" className="hs__thin" />

        {/* courtyard: palms, festoons, globe lamp, table */}
        <path d="M560 470 C566 420 570 380 576 330" />
        <path d="M576 330 c-30 -6 -54 6 -70 22 M576 330 c-8 -26 -30 -42 -54 -46 M576 330 c10 -28 34 -40 58 -40 M576 330 c28 -4 50 10 62 28 M576 330 c-2 -30 6 -50 18 -62" className="hs__frond" />
        <path d="M652 470 C648 420 646 370 642 318" />
        <path d="M642 318 c-30 -6 -54 6 -70 22 M642 318 c-8 -26 -30 -42 -54 -46 M642 318 c10 -28 34 -40 58 -40 M642 318 c28 -4 50 10 62 28 M642 318 c-2 -30 6 -50 18 -62" className="hs__frond" />
        <path d="M484 278 Q627 330 770 300" className="hs__thin" />
        <path d="M728 470 V392" />
        <circle cx="728" cy="384" r="8" />
        <circle cx="714" cy="392" r="6" />
        <circle cx="742" cy="392" r="6" />
        <path d="M600 470 V444 M584 440 H616" className="hs__thin" />
        <path d="M576 470 v-20 h-10 M624 470 v-20 h10" className="hs__chair" />

        {/* rear wing: two storeys, timber frame, curved tiebeam upstairs */}
        <path d="M774 470 V300 H1122 V470" />
        <path d="M756 304 L948 188 L1140 304" />
        <path d="M774 386 H1122" className="hs__thin" />
        {/* ground floor of the wing: timber posts with brick nogging between */}
        <path d="M832 470 V386 M890 470 V386 M948 470 V386 M1006 470 V386 M1064 470 V386" className="hs__thin" />
        <path d="M774 428 L832 386 M890 386 L948 428 M1006 428 L1064 386" className="hs__thin" />
        {/* upstairs: the cambered tie-beam on arched braces, still on show */}
        <path d="M776 316 Q948 296 1120 316" className="hs__beam" />
        <path d="M776 366 Q778 326 830 312 M1120 366 Q1118 326 1066 312" className="hs__beam" />
        <path d="M948 196 V304" className="hs__thin" />
        <path d="M896 386 v-16 h52 v16" className="hs__thin" />
        <path d="M922 370 v-8" className="hs__thin" />
        <circle cx="922" cy="358" r="3.5" className="hs__candle" />
      </g>

      {/* numbers that match the tabs */}
      {(
        [
          ['front', 290, 120],
          ['courtyard', 690, 230],
          ['wing', 948, 268],
        ] as const
      ).map(([id, x, y], i) => (
        <g key={id} className={`hs__num ${part === id ? 'is-on' : ''}`} onClick={() => onPick(id)}>
          <circle cx={x} cy={y} r="22" />
          <text x={x} y={y + 7} textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
      <text x="12" y="504" className="hs__label">
        SILVER STREET
      </text>
    </svg>
  )
}
