import { Link } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { Img } from '../components/Img'
import { pick } from '../data/menu'

const cocktails = pick('rhubarb-triangle', 'let-s-get-figgy-with-it', 'bacon-egg', 'pickled-tink', 'strawberry-balsamic-sgroppino', 'hibiscus-naked-famous')

export function Drink() {
  return (
    <section id="drink" className="story story--drink on-dark" aria-labelledby="drink-title">
      <div className="story__pics">
        <Img k="hero-glass" sizes="(min-width: 900px) 58vw, 100vw" position="40% 46%" className="story__big" />
        <Img k="bar-front" sizes="(min-width: 900px) 30vw, 60vw" position="50% 62%" className="story__small" />
      </div>
      <div className="wrap story__body">
        <header className="story__head">
          <span className="label">Drink</span>
          <h2 className="title" id="drink-title">
            The Hive List
          </h2>
          <p className="story__lede">
            From the bar team at The Gadabout, on Guildhall Lane since 2018. Rhubarb milk punch, a fat-washed bourbon sour, and a martini
            finished with pickled onion brine. Five mocktails too, all £7.
          </p>
          <blockquote className="quote">
            <p>“Cocktails are a highlight too, with an imaginative list that reflects the venue’s sense of fun and flair.”</p>
            <cite>Great Food Club</cite>
          </blockquote>
          <Link to="/menu/cocktails" className="link">
            Martinis, spritzes, wine and beer
          </Link>
        </header>
        <ul className="dishes story__list">
          {cocktails.map((it) => (
            <DishRow key={it.id} item={it} />
          ))}
        </ul>
      </div>
    </section>
  )
}
