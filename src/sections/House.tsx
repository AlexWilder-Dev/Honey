import { Img, type ImageKey } from '../components/Img'
import { useUi, type Seat } from '../state/ui'

/* Facts and quotes from the Historic England listing (entry 1361048), Leicester City Council's
 * Market Place Conservation Area Character Appraisal (2007) and Visit Leicester. See intake/research.md. */
const rooms: { id: string; label: string; title: string; body: string; quote?: { text: string; by: string }; photo: ImageKey; caption: string; seat?: Seat; book: string }[] = [
  {
    id: 'front',
    label: 'The front · 18th century',
    title: 'The bar, in the Georgian front',
    body: 'Painted brick, a steep slate roof and paired brackets under wide eaves, three storeys up from Silver Street. Through the yellow door the bar front is a wall of lit hexagons.',
    quote: { text: '“an 18th century brick building, although much altered, with a classical style stone doorcase”', by: 'Leicester City Council' },
    photo: 'bar-front',
    caption: 'The bar, just inside the front door.',
    book: 'Book a table',
  },
  {
    id: 'courtyard',
    label: 'Out the back',
    title: 'The courtyard, by day',
    body: 'Between the front and the old wing: two palm trees, festoon lights, a globe lamp and lime-green chairs. A quick drink in the afternoon, a minute from St Martin’s Square.',
    quote: { text: '“the perfect hideaway from the bustle of the city centre”', by: 'Visit Leicester' },
    photo: 'courtyard-day',
    caption: 'The courtyard in the afternoon.',
    seat: 'The courtyard',
    book: 'Book the courtyard',
  },
  {
    id: 'wing',
    label: 'The rear wing · probably 16th or 17th century',
    title: 'Upstairs, by evening',
    body: 'Much older than the front: timber-framed, with brick between the timbers. Upstairs the curved beams are still on show, and dinner goes slower and candlelit.',
    quote: { text: '“arched brackets to curved tiebeam exposed in first floor room”', by: 'Historic England' },
    photo: 'upstairs',
    caption: 'Dinner upstairs, under the old timbers.',
    seat: 'Upstairs',
    book: 'Book upstairs',
  },
]

export function House() {
  const { openBooking } = useUi()
  return (
    <section id="house" className="house section on-light" aria-labelledby="house-title">
      <div className="wrap">
        <p className="kicker-row">
          <span className="no">No. 04</span>
          <span>The house</span>
          <span className="rest">Grade II listed since 1975</span>
        </p>
        <header className="house__head">
          <h2 className="headline" id="house-title">
            A Georgian front, <em>and a much older house behind it</em>
          </h2>
          <p className="standfirst">
            Historic England lists it as “42 Silver Street including wing at rear”, and the council reckons part of a 15th-century hall house
            survives back there. Three rooms, three moods.
          </p>
        </header>

        <div className="rooms">
          {rooms.map((r) => (
            <article key={r.id} className={`room room--${r.id}`}>
              <figure className="room__figure">
                <Img k={r.photo} sizes="(min-width: 900px) 40vw, 92vw" className="room__img" />
                <figcaption className="caption">{r.caption}</figcaption>
              </figure>
              <div className="room__text">
                <span className="label">{r.label}</span>
                <h3 className="subtitle">{r.title}</h3>
                <p>{r.body}</p>
                {r.quote && (
                  <blockquote className="quote">
                    <p>{r.quote.text}</p>
                    <cite>{r.quote.by}</cite>
                  </blockquote>
                )}
                <button type="button" className="link" onClick={() => openBooking({ seat: r.seat })}>
                  {r.book} →
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="street" aria-labelledby="street-title">
          <h3 className="label" id="street-title">
            Silver Street, briefly
          </h3>
          <ol>
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
        </aside>
      </div>
    </section>
  )
}
