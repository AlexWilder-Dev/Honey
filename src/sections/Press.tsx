import { reviews, venue } from '../data/venue'

/* Great Food Club quotes from https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/ */
export function Press() {
  return (
    <section className="press section on-light" aria-labelledby="press-title">
      <div className="wrap press__grid">
        <div>
          <span className="eyebrow" id="press-title">
            What people say
          </span>
          <blockquote className="press__big">
            <p>“A buzzy, cosmopolitan vibe – helped by a spacious courtyard and elegant branding.”</p>
            <cite>
              <a href="https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/" target="_blank" rel="noreferrer">
                Great Food Club
              </a>
            </cite>
          </blockquote>
        </div>
        <div className="press__google">
          <p className="press__score">
            <span className="press__num">{venue.google.rating}</span>
            <span>
              on Google
              <br />
              from {venue.google.count} reviews
            </span>
          </p>
          <ul>
            {reviews.map((r) => (
              <li key={r.quote}>
                <p>“{r.quote}”</p>
                <cite>{r.source}</cite>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
