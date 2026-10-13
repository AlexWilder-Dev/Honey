import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { Pomsky, PomskyWoof } from '../components/Pomsky'
import { Wordmark } from '../components/Wordmark'
import { useUi } from '../state/ui'

/** Their courtyard, edge to edge, with the name over it. */
export function Hero() {
  const { openBooking } = useUi()
  const { up, knock } = useKnock()
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" onPointerDown={knock}>
        <Img k="courtyard-crowd" priority sizes="100vw" position="50% 63%" />
        <Pomsky up={up} />
        <PomskyWoof up={up} />
      </div>
      <div className="hero__copy wrap">
        <h1 className="hero__mark" id="hero-title">
          <Wordmark />
        </h1>
        <div className="hero__foot">
          <p>Cocktails and sharing plates at 42&nbsp;Silver&nbsp;Street, Leicester.</p>
          <div className="hero__actions">
            <button type="button" className="btn btn--light" onClick={() => openBooking()}>
              Book a table
            </button>
            <Link to="/menu" className="btn btn--ghost">
              Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Five taps on the photograph inside a second, and someone pops up to say hello. */
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
