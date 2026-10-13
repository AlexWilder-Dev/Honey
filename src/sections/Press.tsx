import { Img } from '../components/Img'
import { reviews, venue } from '../data/venue'

/* Great Food Club quote from https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/ */
export function Press() {
  return (
    <section className="press on-light" aria-label="What people say">
      <div className="wrap press__grid">
        <Img k="cheers" sizes="(min-width: 900px) 34vw, 100vw" position="50% 40%" className="press__img" />
        <div className="press__words">
          <blockquote className="press__big">
            <p>“A buzzy, cosmopolitan vibe – helped by a spacious courtyard and elegant branding.”</p>
            <cite>
              <a href="https://www.greatfoodclub.co.uk/business/hive-and-honey-leicester/" target="_blank" rel="noreferrer">
                Great Food Club
              </a>
            </cite>
          </blockquote>
          <ul className="press__more">
            {reviews.map((r) => (
              <li key={r.quote}>
                “{r.quote}” <cite>{r.source}</cite>
              </li>
            ))}
          </ul>
          <p className="press__score">
            {venue.google.rating} on Google, from {venue.google.count} reviews
          </p>
        </div>
      </div>
    </section>
  )
}
