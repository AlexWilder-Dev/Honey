import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { lately, regular, upcoming, type VenueEvent } from '../data/events'
import { useUi } from '../state/ui'

export function WhatsOn() {
  const list = upcoming()
  return (
    <section id="on" className="on section on-light" aria-labelledby="on-title">
      <div className="wrap">
        <div className="on__head">
          <div>
            <span className="eyebrow">What’s on</span>
            <h2 className="title" id="on-title">
              Coming up at Hive &amp; Honey
            </h2>
          </div>
          <p className="on__regular">
            <strong>{regular.title}</strong>
            <span>{regular.when}</span>
            <em>“{regular.quote}”</em>
          </p>
        </div>

        <ul className="on__list">
          {list.map((e) => (
            <li key={e.id} className="ev">
              <EventCard e={e} />
            </li>
          ))}
        </ul>

        <div className="lately">
          <span className="eyebrow">Lately</span>
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
  const [first, ...rest] = e.kicker.split(' ')
  return (
    <>
      {e.poster ? (
        <Img k={e.poster} sizes="(min-width: 900px) 30vw, 40vw" className="ev__visual" />
      ) : (
        // no printed poster for this one, so the offer is set as one
        <div className="ev__visual ev__type" aria-hidden="true">
          <span className="ev__type-small">{first}</span>
          <span className="ev__type-big">{rest.join(' ')}</span>
          <span className="ev__type-small">{e.when}</span>
        </div>
      )}
      <div className="ev__body">
        <p className="ev__when">
          {e.when} · {e.time}
        </p>
        <h3 className="subtitle">{e.title}</h3>
        <p className="ev__by">{e.kicker}</p>
        <p className="ev__blurb">{e.blurb}</p>
        <div className="ev__actions">
          <button type="button" className="btn btn--yellow btn--small" onClick={book}>
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
