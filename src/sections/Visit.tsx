import { Fragment } from 'react'
import { Img } from '../components/Img'
import { RightNow } from '../components/RightNow'
import { goodToKnow, venue } from '../data/venue'
import { kitchenAnswer, serviceMoment, weekRows } from '../lib/time'
import { useVenueClock } from '../state/clock'
import { useUi } from '../state/ui'

const ROWS = weekRows()

export function Visit() {
  const { moment, status } = useVenueClock()
  const { openBooking } = useUi()
  const today = serviceMoment(moment).day
  const kitchen = kitchenAnswer(moment)
  const answers = [
    { q: 'Open now?', a: status.barOpen ? 'Yes.' : 'Not right now.', live: status.barOpen },
    { q: 'Kitchen on?', a: kitchen.text, live: kitchen.open },
    ...goodToKnow.map((g) => ({ ...g, live: undefined })),
  ]

  return (
    <section id="visit" className="visit on-dark" aria-labelledby="visit-title">
      <div className="wrap visit__grid">
        <div className="visit__where">
          <p className="dashed dashed--left">visit</p>
          <h2 className="h-caps h-xl" id="visit-title">
            {venue.street}
          </h2>
          <p className="lead">
            {venue.city} {venue.postcode}, in the Old Town, right next to St Martin’s Square.
          </p>
          <p className="visit__walkin">
            “Walk-ins are greeted with open wings,” as they put it. Or book ahead.
          </p>
          <div className="visit__actions">
            <button type="button" className="btn btn--yellow" onClick={() => openBooking()}>
              Book a table
            </button>
            <a className="btn btn--line" href={venue.directions} target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
          <p className="visit__contact">
            <a href={venue.phoneHref}>{venue.phone}</a>
            <a href={`mailto:${venue.email}`}>{venue.email}</a>
            <a href={venue.instagram} target="_blank" rel="noreferrer">
              {venue.instagramHandle}
            </a>
          </p>
          <figure className="visit__door">
            <Img k="door" sizes="150px" />
            <figcaption>Look for the yellow door.</figcaption>
          </figure>
        </div>

        <div className="visit__when">
          <div className="visit__now">
            <RightNow />
          </div>
          <table className="hours">
            <caption className="sr-only">Opening hours</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Days</span>
                </th>
                <th scope="col">Bar</th>
                <th scope="col">Kitchen</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const now = r.days.includes(today)
                return (
                  <tr key={r.label} className={now ? 'is-today' : ''}>
                    <th scope="row">
                      <span className="hours__long">{r.label}</span>
                      <span className="hours__short">{r.short}</span>
                    </th>
                    <td>
                      <span>{r.bar}</span>
                    </td>
                    <td>
                      {r.services.map((sv, i) => (
                        <Fragment key={sv}>
                          {i > 0 && ', '}
                          <span>{sv}</span>
                        </Fragment>
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="visit__note">The bar and courtyard stay open between lunch and dinner.</p>
          <dl className="answers">
            {answers.map((x) => (
              <div key={x.q} className={`answers__row ${x.live === undefined ? '' : x.live ? 'is-yes' : 'is-no'}`}>
                <dt>{x.q}</dt>
                <dd>{x.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
