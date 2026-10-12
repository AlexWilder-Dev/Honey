import { Pour } from '../components/Pour'
import { reviews, venue } from '../data/venue'

/* Great Food Club quotes from https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/ */
export function Press() {
  return (
    <section className="press on-light" aria-labelledby="press-title">
      <div className="wrap press__grid">
        <Pour className="press__lead">
          <h2 className="sr-only" id="press-title">
            What people say
          </h2>
          <blockquote className="press__big">
            <p>“A buzzy, cosmopolitan vibe – helped by a spacious courtyard and elegant branding.”</p>
            <cite>
              <a href="https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/" target="_blank" rel="noreferrer">
                Great Food Club
              </a>
            </cite>
          </blockquote>
        </Pour>
        <div className="press__google">
          <p className="press__score">
            <strong>{venue.google.rating}</strong> on Google, from {venue.google.count} reviews
          </p>
          <ul>
            {reviews.map((r, i) => (
              <Pour as="li" key={r.quote} delay={i * 0.08}>
                <p>“{r.quote}”</p>
                <cite>{r.source}</cite>
              </Pour>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
