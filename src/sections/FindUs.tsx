import { Fragment } from 'react'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { goodToKnow, venue } from '../data/venue'
import { kitchenAnswer, serviceMoment, weekRows } from '../lib/time'
import { useVenueClock } from '../state/clock'

const ROWS = weekRows()

/** The practical questions, answered before anyone has to ask. */
export function FindUs() {
  const { moment, status, demo } = useVenueClock()
  const today = serviceMoment(moment).day
  const kitchen = kitchenAnswer(moment)

  const answers = [
    { q: 'Open now?', a: status.barOpen ? `Yes. ${status.line}.` : `Not right now. ${status.line}.`, live: status.barOpen },
    { q: 'Kitchen on?', a: kitchen.text, live: kitchen.open },
    ...goodToKnow.map((g) => ({ ...g, live: undefined })),
  ]

  return (
    <section id="find" className="find on-paper" aria-labelledby="find-title">
      <div className="wrap find__grid">
        <Pour className="find__where">
          <p className="kicker">Find us</p>
          <h2 className="display title find__title" id="find-title">
            {venue.street}
          </h2>
          <p className="find__addr">
            {venue.city} {venue.postcode}, in {venue.area}
          </p>
          <div className="find__actions">
            <a className="btn btn--ink" href={venue.directions} target="_blank" rel="noreferrer">
              Directions
            </a>
            <a className="btn btn--line" href={venue.phoneHref}>
              {venue.phone}
            </a>
          </div>
          <p className="find__contact">
            <a href={`mailto:${venue.email}`}>{venue.email}</a>
            <a href={venue.instagram} target="_blank" rel="noreferrer">
              {venue.instagramHandle}
            </a>
          </p>
          <figure className="find__door">
            <Img k="door" sizes="140px" />
            <figcaption>Look for the yellow door.</figcaption>
          </figure>
        </Pour>

        <Pour className="find__when" delay={0.1}>
          <h3 className="find__sub">
            Quick answers{demo && <span className="now__demo">demo time</span>}
          </h3>
          <dl className="answers">
            {answers.map((x) => (
              <div key={x.q} className={`answers__row ${x.live === undefined ? '' : x.live ? 'is-yes' : 'is-no'}`}>
                <dt>{x.q}</dt>
                <dd>
                  {x.live !== undefined && <span className="answers__dot" aria-hidden="true" />}
                  {x.a}
                </dd>
              </div>
            ))}
          </dl>

          <table className="hours">
            <caption>The week</caption>
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
                      {now && <span className="hours__today">today</span>}
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
          <p className="find__note">Bar and courtyard stay open between services.</p>
        </Pour>
      </div>
    </section>
  )
}
