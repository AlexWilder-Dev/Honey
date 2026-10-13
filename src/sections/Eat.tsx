import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { countItems, pick } from '../data/menu'

const plates = pick(
  'salted-cod-pakora',
  'wagyu-anticucho-bite',
  'red-leicester-terrine',
  'crispy-squid',
  'mojo-verde-pork-belly',
  'scallops-causa',
  'short-rib-moussaka',
  'tzatziki-foam',
)
const pizzas = pick('margherita', 'aubergine', 'spicy', 'tuna')

/** A dish someone in print picked out, quoted beside it. */
const notes: Record<string, { quote: string; by: string }> = {
  'salted-cod-pakora': { quote: '“We especially enjoyed the… salt cod pakoras”', by: 'Great Food Club' },
}

export function Eat() {
  return (
    <section id="eat" className="course course--eat section on-stone" aria-labelledby="eat-title">
      <div className="wrap course__grid">
        <div className="course__head">
          <span className="eyebrow">Eat</span>
          <h2 className="title" id="eat-title">
            Small plates &amp; pizzas
          </h2>
          <p className="lead">
            From the team behind Dom in Thurlaston, a Great Food Club Restaurant of the Year finalist in 2022/23. Globally inspired plates
            with Asian flavours running through, built for sharing.
          </p>
          <p className="course__how">
            <span className="course__plus" aria-hidden="true">+</span> Tap to put a plate on your table. When you book, it goes in the email.
          </p>
          <Img k="hero-plates" sizes="(min-width: 900px) 34vw, 92vw" position="50% 40%" className="course__photo" />
        </div>

        <div className="course__list">
          <ul className="dishes dishes--big">
            {plates.map((it) => (
              <DishRow key={it.id} item={it} size="big" note={notes[it.id]} />
            ))}
          </ul>
          <h3 className="dashed course__sub">Pizza</h3>
          <ul className="dishes">
            {pizzas.map((it) => (
              <DishRow key={it.id} item={it} />
            ))}
          </ul>
          <Link to="/menu/plates" className="link course__more">
            All {countItems('plate')} plates, pizzas and desserts →
          </Link>
        </div>
      </div>
    </section>
  )
}
