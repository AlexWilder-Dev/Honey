import { reviews, venue } from '../data/venue'

/* Great Food Club quotes from https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/ */
export function Press() {
  return (
    <section className="press section on-stone" aria-labelledby="press-title">
      <div className="wrap">
        <p className="kicker-row">
          <span className="no">No. 05</span>
          <span id="press-title">Notices</span>
          <span className="rest">
            {venue.google.rating} on Google · {venue.google.count} reviews
          </span>
        </p>
        <blockquote className="press__big">
          <p>“A buzzy, cosmopolitan vibe – helped by a spacious courtyard and elegant branding.”</p>
          <cite>
            <a href="https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/" target="_blank" rel="noreferrer">
              Great Food Club
            </a>
          </cite>
        </blockquote>
        <ul className="press__letters">
          {reviews.map((r) => (
            <li key={r.quote}>
              <p>“{r.quote}”</p>
              <cite>{r.source}</cite>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
