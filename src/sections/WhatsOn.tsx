import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { lately, regular, upcoming, type VenueEvent } from '../data/events'
import { useUi } from '../state/ui'

/** The diary page: what's coming up, set like a listings column. */
export function WhatsOn() {
  const list = upcoming()
  return (
    <section id="on" className="diary section on-stone" aria-labelledby="on-title">
      <div className="wrap">
        <p className="kicker-row">
          <span className="no">No. 03</span>
          <span>Diary</span>
          <span className="rest">What’s on</span>
        </p>
        <div className="diary__grid">
          <header className="diary__head">
            <h2 className="headline" id="on-title">
              Coming up <em>at No. 42</em>
            </h2>
            <div className="diary__regular">
              <span className="label">Every month</span>
              <p className="subtitle">{regular.title}</p>
              <p>{regular.when}.</p>
              <p className="diary__quote">“{regular.quote}”</p>
            </div>
          </header>

          <ol className="diary__list">
            {list.map((e) => (
              <li key={e.id}>
                <Entry e={e} />
              </li>
            ))}
          </ol>
        </div>

        <div className="lately">
          <span className="label">From the archive</span>
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

function Entry({ e }: { e: VenueEvent }) {
  const { openBooking } = useUi()
  return (
    <article className="entry">
      <p className="entry__date">
        <span className="entry__when">{e.when}</span>
        <span className="label">{e.time}</span>
      </p>
      <div className="entry__body">
        <span className="label">{e.kicker}</span>
        <h3 className="subtitle">{e.title}</h3>
        <p>{e.blurb}</p>
        <div className="entry__actions">
          <button type="button" className="link" onClick={() => openBooking({ occasion: e.occasion ?? e.title })}>
            Book a table →
          </button>
          {e.id === 'christmas' && (
            <Link to="/christmas" className="link">
              The menu →
            </Link>
          )}
        </div>
      </div>
      {e.poster && <Img k={e.poster} sizes="160px" className="entry__poster" />}
    </article>
  )
}
