import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { menu, pick } from '../data/menu'
import { money } from '../lib/format'

const cocktails = pick(
  'rhubarb-triangle',
  'let-s-get-figgy-with-it',
  'bacon-egg',
  'pickled-tink',
  'strawberry-balsamic-sgroppino',
  'hibiscus-naked-famous',
  'blood-orange-daiquiri',
)
const mocktails = menu.find((t) => t.id === 'cocktails')!.sections.find((s) => s.id === 'mocktails')!.items
const mocktailPrices = [...new Set(mocktails.map((m) => m.prices[0].amount))]

export function Drink() {
  return (
    <section id="drink" className="course course--drink on-dark" aria-labelledby="drink-title">
      <div className="wrap course__grid">
        <div className="course__head">
          <p className="dashed dashed--left">the hive list</p>
          <h2 className="h-caps h-l" id="drink-title">
            From The Gadabout bar team
          </h2>
          <p className="lead">
            The Gadabout has been mixing on Guildhall Lane since 2018, named for “a habitual pleasure-seeker”. The list here runs from
            rhubarb milk punch to a martini finished with pickled onion brine.
          </p>
          <blockquote className="course__quote">
            <p>“Cocktails are a highlight too, with an imaginative list that reflects the venue’s sense of fun and flair.”</p>
            <cite>Great Food Club</cite>
          </blockquote>
          <div className="course__photos">
            <Pour className="course__photo">
              <Img k="bar-front" sizes="(min-width: 900px) 26vw, 60vw" position="50% 60%" />
            </Pour>
            <Pour className="course__photo course__photo--small" delay={0.15}>
              <Img k="espresso" sizes="(min-width: 900px) 14vw, 36vw" />
            </Pour>
          </div>
        </div>

        <div className="course__list">
          <ul className="dishes dishes--big">
            {cocktails.map((it) => (
              <DishRow key={it.id} item={it} size="big" />
            ))}
          </ul>
          <p className="course__zero">
            <strong>Not drinking?</strong> {mocktails.length} mocktails
            {mocktailPrices.length === 1 ? `, all ${money(mocktailPrices[0])}` : ''}, from a Nada-Rita made with Heineken 0% and spicy
            mango to a Hugo with 0% prosecco.
          </p>
          <Link to="/menu/cocktails" className="link course__more">
            Martinis, spritzes, wine and beer →
          </Link>
        </div>
      </div>
    </section>
  )
}
