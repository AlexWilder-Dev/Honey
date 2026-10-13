import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { countItems, pick } from '../data/menu'

const plates = pick('salted-cod-pakora', 'wagyu-anticucho-bite', 'red-leicester-terrine', 'crispy-squid', 'mojo-verde-pork-belly', 'scallops-causa', 'short-rib-moussaka', 'tzatziki-foam')
const pizzas = pick('margherita', 'aubergine', 'spicy', 'tuna')

/** A dish someone in print picked out, quoted beside it. */
const notes: Record<string, { quote: string; by: string }> = {
  'salted-cod-pakora': { quote: '“We especially enjoyed the… salt cod pakoras”', by: 'Great Food Club' },
}

export function Eat() {
  return (
    <section id="eat" className="feature section on-light" aria-labelledby="eat-title">
      <div className="wrap">
        <p className="kicker-row">
          <span className="no">No. 01</span>
          <span>Eat</span>
          <span className="rest">Kitchen noon–3 &amp; 5–11 · Mondays from 5</span>
        </p>
        <div className="feature__grid">
          <header className="feature__head">
            <h2 className="headline" id="eat-title">
              Small plates, <em>passed around</em>
            </h2>
            <p className="standfirst">
              The kitchen comes from Dom in Thurlaston, a Great Food Club Restaurant of the Year finalist in 2022/23. Here they cook globally
              inspired plates with Asian flavours running through, and a short list of pizzas.
            </p>
            <figure className="feature__figure">
              <Img k="hero-plates" sizes="(min-width: 900px) 36vw, 92vw" position="50% 40%" className="feature__img" />
              <figcaption className="caption">
                <b>A table’s worth.</b> Order a few each and put everything in the middle.
              </figcaption>
            </figure>
          </header>

          <div className="feature__menu">
            <h3 className="dashed">Plates</h3>
            <ul className="dishes">
              {plates.map((it) => (
                <DishRow key={it.id} item={it} size="big" note={notes[it.id]} />
              ))}
            </ul>
            <h3 className="dashed feature__sub">Pizza</h3>
            <ul className="dishes">
              {pizzas.map((it) => (
                <DishRow key={it.id} item={it} />
              ))}
            </ul>
            <Link to="/menu/plates" className="link feature__more">
              All {countItems('plate')} plates, pizzas and desserts →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
