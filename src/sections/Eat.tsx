import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { countItems, pick } from '../data/menu'

const plates = pick('salted-cod-pakora', 'wagyu-anticucho-bite', 'red-leicester-terrine', 'crispy-squid', 'mojo-verde-pork-belly', 'scallops-causa', 'short-rib-moussaka')
const notes: Record<string, { quote: string; by: string }> = {
  'salted-cod-pakora': { quote: '“We especially enjoyed the… salt cod pakoras”', by: 'Great Food Club' },
}

export function Eat() {
  return (
    <section id="eat" className="story story--eat on-light" aria-labelledby="eat-title">
      <div className="story__pics">
        <Img k="hero-plates" sizes="(min-width: 900px) 58vw, 100vw" position="50% 42%" className="story__big" />
        <Img k="kitchen" sizes="(min-width: 900px) 30vw, 60vw" position="50% 58%" className="story__small" />
      </div>
      <div className="wrap story__body">
        <header className="story__head">
          <span className="label">Eat</span>
          <h2 className="title" id="eat-title">
            Small plates, <em>for the middle of the table</em>
          </h2>
          <p className="story__lede">
            The kitchen is the team behind Dom in Thurlaston, a Great Food Club Restaurant of the Year finalist in 2022/23. Globally inspired
            plates with Asian flavours running through, and a short list of pizzas.
          </p>
          <Link to="/menu/plates" className="link">
            All {countItems('plate')} plates, pizzas and desserts
          </Link>
        </header>
        <ul className="dishes story__list">
          {plates.map((it) => (
            <DishRow key={it.id} item={it} note={notes[it.id]} />
          ))}
        </ul>
      </div>
    </section>
  )
}
