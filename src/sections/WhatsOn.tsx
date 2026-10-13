import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { regular, upcoming } from '../data/events'
import { useUi } from '../state/ui'

export function WhatsOn() {
  const { openBooking } = useUi()
  const list = upcoming()
  return (
    <section id="on" className="events on-stone" aria-labelledby="on-title">
      <div className="wrap">
        <header className="events__head">
          <span className="label">What’s on</span>
          <h2 className="title" id="on-title">
            Coming up
          </h2>
          <p className="story__lede">
            {regular.title}: a DJ in the courtyard on the last Friday of every month, 8pm till 1am.
          </p>
        </header>
        <ul className="events__list">
          {list.map((e) => (
            <li key={e.id} className="event">
              {e.poster ? (
                <Img k={e.poster} sizes="(min-width: 900px) 26vw, 40vw" className="event__img" />
              ) : (
                <div className="event__img event__type" aria-hidden="true">
                  <span>{e.kicker}</span>
                </div>
              )}
              <p className="event__when">
                {e.when} · {e.time}
              </p>
              <h3 className="subtitle">{e.title}</h3>
              <p className="event__blurb">{e.blurb}</p>
              <div className="event__actions">
                <button type="button" className="link" onClick={() => openBooking({ occasion: e.occasion ?? e.title })}>
                  Book a table
                </button>
                {e.id === 'christmas' && (
                  <Link to="/christmas" className="link">
                    The menu
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
