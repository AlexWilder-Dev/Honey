import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { menu, pick } from '../data/menu'
import { money } from '../lib/format'

const cocktails = pick('rhubarb-triangle', 'let-s-get-figgy-with-it', 'bacon-egg', 'pickled-tink', 'strawberry-balsamic-sgroppino', 'hibiscus-naked-famous', 'blood-orange-daiquiri')
const mocktails = menu.find((t) => t.id === 'cocktails')!.sections.find((s) => s.id === 'mocktails')!.items
const mocktailPrices = [...new Set(mocktails.map((m) => m.prices[0].amount))]

export function Drink() {
  return (
    <section id="drink" className="feature feature--drink section on-dark" aria-labelledby="drink-title">
      <div className="wrap">
        <p className="kicker-row">
          <span className="no">No. 02</span>
          <span>Drink</span>
          <span className="rest">Bar till midnight · 1:30am Fri &amp; Sat</span>
        </p>
        <div className="feature__grid feature__grid--flip">
          <header className="feature__head">
            <h2 className="headline" id="drink-title">
              The Hive List
            </h2>
            <p className="standfirst">
              The bar team runs The Gadabout on Guildhall Lane, open since 2018 and named for “a habitual pleasure-seeker”. Expect rhubarb milk
              punch, a fat-washed bourbon sour, and a martini finished with pickled onion brine.
            </p>
            <figure className="feature__figure">
              <Img k="bar-front" sizes="(min-width: 900px) 36vw, 92vw" position="50% 62%" className="feature__img feature__img--tall" />
              <figcaption className="caption">
                <b>The bar.</b> Lit yellow hexagons under a timber top, just inside the front door.
              </figcaption>
            </figure>
            <blockquote className="pull">
              <p>“Cocktails are a highlight too, with an imaginative list that reflects the venue’s sense of fun and flair.”</p>
              <cite>Great Food Club</cite>
            </blockquote>
          </header>

          <div className="feature__menu">
            <h3 className="dashed">The Hive List</h3>
            <ul className="dishes">
              {cocktails.map((it) => (
                <DishRow key={it.id} item={it} size="big" />
              ))}
            </ul>
            <p className="feature__aside">
              <span className="label">Not drinking?</span>
              {mocktails.length} mocktails{mocktailPrices.length === 1 ? `, all ${money(mocktailPrices[0])}` : ''}, from a Nada-Rita made with
              Heineken 0% and spicy mango to a Hugo with 0% prosecco.
            </p>
            <Link to="/menu/cocktails" className="link feature__more">
              Martinis, spritzes, wine and beer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
