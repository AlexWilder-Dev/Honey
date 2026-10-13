import { Link } from 'react-router-dom'
import { useGoto, type SectionId } from '../lib/nav'

const index: { id: SectionId; name: string; line: string }[] = [
  { id: 'eat', name: 'Eat', line: 'Small plates and pizzas from the Dom team' },
  { id: 'drink', name: 'Drink', line: 'The Hive List, from The Gadabout’s bar' },
  { id: 'house', name: 'The courtyard', line: 'Palms and festoon lights, round the back' },
]

/** What this place is, in one breath, and where to go next. */
export function Intro() {
  const goto = useGoto()
  return (
    <section className="intro section on-light" aria-labelledby="intro-title">
      <div className="wrap intro__grid">
        <div>
          <span className="eyebrow">Silver Street, Leicester · since 2025</span>
          <h2 className="title title--xl" id="intro-title">
            Proper cocktails and sharing plates, under one roof on Silver Street.
          </h2>
          <p className="lead">
            The bar team from The Gadabout and the kitchen team behind Dom, together under one roof. Walk in for a drink, or book and make
            a night of it.
          </p>
        </div>
        <nav className="intro__index" aria-label="On this page">
          {index.map((x) => (
            <button key={x.id} type="button" onClick={() => goto(x.id)}>
              <span className="intro__name">{x.name}</span>
              <span className="intro__line">{x.line}</span>
              <span className="intro__arrow" aria-hidden="true">
                ↓
              </span>
            </button>
          ))}
          <Link to="/menu">
            <span className="intro__name">The full menu</span>
            <span className="intro__line">Every plate, cocktail, wine and beer</span>
            <span className="intro__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      </div>
    </section>
  )
}
