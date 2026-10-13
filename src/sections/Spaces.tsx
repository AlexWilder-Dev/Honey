import { Img } from '../components/Img'
import { useUi } from '../state/ui'

/* Facts from the Historic England listing (entry 1361048) and Visit Leicester. See intake/research.md. */
export function Spaces() {
  const { openBooking } = useUi()
  return (
    <section id="house" className="spaces on-light" aria-labelledby="spaces-title">
      <div className="wrap">
        <header className="spaces__head">
          <span className="label">The house</span>
          <h2 className="title" id="spaces-title">
            A Grade II listed townhouse, <em>and an older wing behind it</em>
          </h2>
          <p className="story__lede">
            An 18th-century brick front on Silver Street. Out the back, a courtyard, then a timber-framed wing that Historic England dates to
            the 16th or 17th century.
          </p>
        </header>

        <div className="spaces__grid">
          <article className="space space--court">
            <Img k="courtyard-day" sizes="(min-width: 900px) 46vw, 100vw" className="space__img" />
            <span className="label">By day</span>
            <h3 className="subtitle">The courtyard</h3>
            <p>
              Palm trees, festoon lights and lime-green chairs, a minute from St Martin’s Square. Visit Leicester calls it “the perfect hideaway
              from the bustle of the city centre”.
            </p>
            <button type="button" className="link" onClick={() => openBooking({ seat: 'The courtyard' })}>
              Book the courtyard
            </button>
          </article>
          <article className="space space--up">
            <Img k="upstairs" sizes="(min-width: 900px) 40vw, 100vw" className="space__img" />
            <span className="label">By evening</span>
            <h3 className="subtitle">Upstairs</h3>
            <p>Dinner under the old curved beams of the rear wing, slower and candlelit.</p>
            <button type="button" className="link" onClick={() => openBooking({ seat: 'Upstairs' })}>
              Book upstairs
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
