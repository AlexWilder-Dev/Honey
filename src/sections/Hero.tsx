import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { Pomsky, PomskyWoof } from '../components/Pomsky'
import { RightNow } from '../components/RightNow'
import { Wordmark } from '../components/Wordmark'
import { venue } from '../data/venue'
import { useUi } from '../state/ui'

/** What their own site scrolls across its homepage, with the rest of the pitch in between. */
const TICKER = ['42 Silver Street', 'Leicester LE1 5ET', 'Cocktails', 'Sharing plates', 'The courtyard', 'Walk-ins welcome']

export function Hero() {
  const { openBooking } = useUi()
  const { up, knock } = useKnock()

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__text">
        <p className="eyebrow">Cocktail bar &amp; sharing plates · Leicester Old Town</p>
        <h1 className="hero__mark" id="hero-title">
          <Wordmark />
        </h1>
        <p className="hero__lead">
          Cocktails from the bar team behind The Gadabout, sharing plates from the people behind Dom, and a courtyard round the back of{' '}
          {venue.street}.
        </p>
        <div className="hero__now">
          <RightNow />
        </div>
        <div className="hero__actions">
          <button type="button" className="btn btn--yellow" onClick={() => openBooking()}>
            Book a table
          </button>
          <Link to="/menu" className="btn btn--line">
            See the menu
          </Link>
        </div>
      </div>

      <figure className="hero__photo" onPointerDown={knock}>
        <Img k="courtyard-crowd" priority sizes="(min-width: 900px) 50vw, 100vw" position="50% 62%" />
        <Pomsky up={up} />
        <PomskyWoof up={up} />
        <figcaption>The courtyard</figcaption>
      </figure>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__run">
          {[0, 1].map((n) => (
            <span key={n} className="ticker__set">
              {TICKER.map((t) => (
                <span key={t}>
                  {t}
                  <i>*</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Five taps on the photo inside a second, and someone pops up to say hello. */
function useKnock(times = 5, within = 1000, stay = 5000) {
  const taps = useRef<number[]>([])
  const [up, setUp] = useState(false)
  useEffect(() => {
    if (!up) return
    const t = window.setTimeout(() => setUp(false), stay)
    return () => window.clearTimeout(t)
  }, [up, stay])
  const knock = () => {
    const now = performance.now()
    taps.current = [...taps.current.filter((t) => now - t < within), now]
    if (taps.current.length >= times) {
      taps.current = []
      setUp(true)
    }
  }
  return { up, knock }
}
