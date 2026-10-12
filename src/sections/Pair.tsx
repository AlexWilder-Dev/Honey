import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { venue } from '../data/venue'

export function Pair() {
  return (
    <section className="pair on-paper" aria-labelledby="pair-title">
      <div className="wrap pair__grid">
        <Pour className="pair__intro">
          <p className="kicker">Since {venue.opened}</p>
          <h2 className="display title pair__title" id="pair-title">
            {venue.strapline}
          </h2>
          <p className="lede">Two local teams went halves on a house. One brought the kitchen, the other brought the bar.</p>
        </Pour>

        <Pour className="pair__side pair__side--bar" delay={0.05}>
          <Img k="bar" lit sizes="(min-width: 900px) 40vw, 86vw" position="50% 46%" className="pair__photo" />
          <div className="pair__text">
            <p className="kicker">The bar</p>
            <h3 className="pair__name">
              From <em>The Gadabout</em>
            </h3>
            <p className="body">
              The cocktail team from Guildhall Lane. Milk punch, fat-washed bourbon, fig shrub, and a martini made whichever way you like it.
            </p>
          </div>
        </Pour>

        <p className="pair__amp amp" aria-hidden="true">
          &amp;
        </p>

        <Pour className="pair__side pair__side--kitchen" delay={0.15}>
          <Img k="plate" sizes="(min-width: 900px) 26vw, 64vw" className="pair__photo" />
          <div className="pair__text">
            <p className="kicker">The kitchen</p>
            <h3 className="pair__name">
              From <em>Dom</em>
            </h3>
            <p className="body">
              The people behind Dom in Blaby. Globally inspired sharing plates with Asian flavours running through, and flavour combinations you wouldn't guess.
            </p>
          </div>
        </Pour>

        <Pour className="pair__house" delay={0.1}>
          <p>
            All under one steep slate roof: a Grade II listed 18th-century townhouse at {venue.street}, in {venue.area}.
          </p>
        </Pour>
      </div>
    </section>
  )
}
