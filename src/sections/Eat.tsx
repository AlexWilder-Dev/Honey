import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { countItems, pick } from '../data/menu'

const highlights = pick(
  'red-leicester-terrine',
  'crispy-squid',
  'wagyu-anticucho-bite',
  'salted-cod-pakora',
  'scallops-causa',
  'short-rib-moussaka',
  'tzatziki-foam',
)
const pizzas = pick('margherita', 'aubergine', 'spicy', 'tuna')

export function Eat() {
  return (
    <section id="eat" className="course course--eat on-paper" aria-labelledby="eat-title">
      <div className="wrap course__grid">
        <div className="course__media">
          <Pour className="course__photo">
            <Img k="hero-plates" lit sizes="(min-width: 900px) 40vw, 92vw" position="50% 42%" />
          </Pour>
          <p className="course__caption">A few plates each, everything in the middle.</p>
        </div>

        <div className="course__menu">
          <Pour>
            <p className="kicker">Eat</p>
            <h2 className="display title course__title" id="eat-title">
              Peruvian, Korean, Greek, Thai <span className="amp">&amp;</span> a little Red Leicester
            </h2>
            <p className="lede course__lede">The kitchen borrows from everywhere, then puts it on small plates for the middle of the table.</p>
            <p className="course__how">
              <span className="course__plus" aria-hidden="true">+</span> Tap to put a plate on your table. Book, and it comes with you.
            </p>
          </Pour>

          <ul className="dishes dishes--big">
            {highlights.map((it) => (
              <DishRow key={it.id} item={it} size="big" />
            ))}
          </ul>

          <div className="pizza">
            <Img k="pizza" sizes="180px" className="pizza__photo" />
            <div>
              <h3 className="pizza__title">
                And a short pizza list
              </h3>
              <ul className="dishes">
                {pizzas.map((it) => (
                  <DishRow key={it.id} item={it} />
                ))}
              </ul>
            </div>
          </div>

          <Link to="/menu/plates" className="text-link course__more">
            All {countItems('plate')} plates, pizzas and puddings <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
