import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { menu, pick } from '../data/menu'
import { money } from '../lib/format'

const highlights = pick(
  'rhubarb-triangle',
  'let-s-get-figgy-with-it',
  'bacon-egg',
  'pickled-tink',
  'strawberry-balsamic-sgroppino',
  'hibiscus-naked-famous',
  'spicy-mango-pina-colada',
)

const mocktails = menu.find((t) => t.id === 'cocktails')!.sections.find((s) => s.id === 'mocktails')!.items
const mocktailPrices = [...new Set(mocktails.map((m) => m.prices[0].amount))]
const wines = menu.find((t) => t.id === 'wine')!.sections.reduce((n, s) => n + s.items.length, 0)

export function Drink() {
  return (
    <section id="drink" className="course course--drink on-night" aria-labelledby="drink-title">
      <div className="wrap course__grid">
        <div className="course__menu">
          <Pour>
            <p className="kicker">Drink</p>
            <h2 className="display title course__title" id="drink-title">
              The Hive List
            </h2>
            <p className="lede course__lede">
              Cocktails from the team behind The Gadabout. Milk punch, fig shrub, fat-washed bourbon, and a martini with pickled onion brine.
            </p>
            <p className="course__how">
              <span className="course__plus" aria-hidden="true">+</span> Tap to add a glass to your table.
            </p>
          </Pour>

          <ul className="dishes dishes--big">
            {highlights.map((it) => (
              <DishRow key={it.id} item={it} size="big" />
            ))}
          </ul>

          <div className="zero">
            <h3 className="zero__title">Not drinking?</h3>
            <p className="body">
              {mocktails.length} mocktails{mocktailPrices.length === 1 ? `, all ${money(mocktailPrices[0])}` : ''}:{' '}
              {mocktails.map((m, i) => (
                <span key={m.id}>
                  {i > 0 && (i === mocktails.length - 1 ? ' and ' : ', ')}
                  <em>{m.name}</em>
                </span>
              ))}
              .
            </p>
          </div>

          <Link to="/menu/cocktails" className="text-link course__more">
            Martinis, spritzes, {wines} wines and the beer list <span className="arrow">→</span>
          </Link>
        </div>

        <div className="course__media">
          <Pour className="course__photo">
            <Img k="backbar" lit sizes="(min-width: 900px) 40vw, 92vw" position="50% 40%" />
          </Pour>
          <Pour className="course__inset" delay={0.2}>
            <Img k="espresso" sizes="(min-width: 900px) 15vw, 40vw" />
          </Pour>
        </div>
      </div>
    </section>
  )
}
