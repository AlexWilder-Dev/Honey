import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { Stars } from '../components/Stars'
import { reviews, venue } from '../data/venue'
import { useGoto } from '../lib/nav'
import { useUi } from '../state/ui'

/** Each review, answered. */
export function Reviews() {
  const goto = useGoto()
  const { openBooking } = useUi()
  const replies = [
    { text: 'Plenty more to find. Start building your table', go: () => goto('eat') },
    { text: 'That’s The Gadabout team. See the Hive List', go: () => goto('drink') },
    { text: 'The courtyard’s round the back. Book a table out there', go: () => openBooking('The courtyard') },
  ]
  return (
    <section className="reviews on-night" aria-labelledby="reviews-title">
      <div className="wrap reviews__grid">
        <Pour className="reviews__score">
          <h2 className="sr-only" id="reviews-title">
            What people say
          </h2>
          <p className="reviews__num display">{venue.google.rating}</p>
          <Stars rating={venue.google.rating} className="reviews__stars" />
          <p className="reviews__count">from {venue.google.count} Google reviews</p>
          <Img k="cheers" lit sizes="(min-width: 900px) 22vw, 50vw" position="50% 40%" className="reviews__photo" />
        </Pour>
        <ul className="reviews__list">
          {reviews.map((r, i) => (
            <Pour as="li" key={r.quote} className={`review review--${i + 1}`} delay={i * 0.12}>
              <blockquote>
                <p>“{r.quote}”</p>
              </blockquote>
              <p className="kicker review__src">{r.source}</p>
              <p className="review__reply">
                <span className="amp" aria-hidden="true">
                  &amp;
                </span>
                <button type="button" className="text-link" onClick={replies[i].go}>
                  {replies[i].text} <span className="arrow">→</span>
                </button>
              </p>
            </Pour>
          ))}
        </ul>
      </div>
    </section>
  )
}
