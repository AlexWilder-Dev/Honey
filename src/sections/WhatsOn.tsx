import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { lately, regular, upcoming, type VenueEvent } from '../data/events'
import { useUi } from '../state/ui'

export function WhatsOn() {
  const list = upcoming()
  return (
    <section id="on" className="on on-yellow" aria-labelledby="on-title">
      <div className="wrap">
        <div className="on__head">
          <h2 className="h-caps h-xl" id="on-title">
            What’s on
          </h2>
          <p className="on__regular">
            <span>
              <strong>{regular.title}</strong>, {regular.when.charAt(0).toLowerCase() + regular.when.slice(1)}
            </span>
            <span className="on__quote">“{regular.quote}”</span>
          </p>
        </div>

        <ul className="on__list">
          {list.map((e, i) => (
            <Pour as="li" key={e.id} delay={i * 0.08} className={`ev ev--${e.id} ${e.poster ? 'ev--poster' : 'ev--type'}`}>
              <EventCard e={e} />
            </Pour>
          ))}
        </ul>

        <div className="lately">
          <h3 className="dashed dashed--left">Lately</h3>
          <ul>
            {lately.map((l) => (
              <li key={l.title}>
                <span className="lately__when">{l.when}</span>
                <strong>{l.title}</strong>
                <span>{l.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function EventCard({ e }: { e: VenueEvent }) {
  const { openBooking } = useUi()
  const book = () => openBooking({ occasion: e.occasion ?? e.title })
  return (
    <>
      {e.poster && <Img k={e.poster} sizes="(min-width: 900px) 30vw, 90vw" className="ev__poster" />}
      <div className="ev__body">
        <p className="ev__when">
          {e.when} <span>· {e.time}</span>
        </p>
        <p className="ev__kicker">{e.kicker}</p>
        <h3 className="ev__title">{e.title}</h3>
        <p className="ev__blurb">{e.blurb}</p>
        <div className="ev__actions">
          <button type="button" className="btn btn--black btn--small" onClick={book}>
            Book a table
          </button>
          {e.id === 'christmas' && (
            <Link to="/christmas" className="link">
              See the menu
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
