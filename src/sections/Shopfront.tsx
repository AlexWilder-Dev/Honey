import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img, type ImageKey } from '../components/Img'
import { Pomsky, PomskyWoof } from '../components/Pomsky'
import { Wordmark } from '../components/Wordmark'
import { nextEvent } from '../data/events'
import { useGoto } from '../lib/nav'
import { useVenueClock } from '../state/clock'
import { useUi } from '../state/ui'

/**
 * The front of 42 Silver Street as the way in, drawn flat like an architect's
 * elevation: red brick and sashes upstairs, black render below, yellow awnings
 * over two shop windows (the bar and the kitchen behind the glass), the yellow
 * door in its stone doorcase, and the lit case by the door with what's
 * happening right now. Everything is placed in proportion to the frontage, so
 * it holds together at any width.
 */
export function Shopfront() {
  const { openBooking } = useUi()
  const { status } = useVenueClock()
  const event = nextEvent()
  const goto = useGoto()

  return (
    <section className="sf" aria-labelledby="sf-title">
      <h1 id="sf-title" className="sr-only">
        Hive &amp; Honey: cocktail bar and sharing plates at 42 Silver Street, Leicester
      </h1>

      <div className="sf__upper" aria-hidden="true">
        <div className="sf__frame sf__frame--upper">
          <span className="sash sash--1" />
          <span className="sash sash--2 sash--lit" />
          <span className="sash sash--3" />
        </div>
      </div>

      <div className="sf__ground">
        <div className="sf__frame sf__frame--ground">
          <div className="sign" aria-hidden="true">
            <span className="sign__arm" />
            <span className="sign__board">
              <Wordmark />
            </span>
          </div>

          <Bay side="left" label="Cocktail bar" photo="hero-glass" position="36% 46%" egg />

          <div className="doorcase">
            <span className="doorcase__cornice" />
            <span className="doorcase__frieze" />
            <span className="doorcase__col doorcase__col--l" />
            <span className="doorcase__col doorcase__col--r" />
            <button type="button" className="door" onClick={() => openBooking()}>
              <span className="door__inside" aria-hidden="true" />
              <span className="door__fan" aria-hidden="true" />
              <span className="door__leaf door__leaf--l" aria-hidden="true" />
              <span className="door__leaf door__leaf--r" aria-hidden="true" />
              <span className="door__plate">Book a table</span>
            </button>
            <span className="doorcase__step" />
          </div>

          <span className="lamp" aria-hidden="true" />
          <Link to="/menu" className={`case case--${status.barOpen ? 'open' : 'closed'}`}>
            <span className="case__state">{status.barOpen ? 'Open' : 'Closed'}</span>
            <span className="case__line">{status.line}</span>
            <span className="case__menu">Menu →</span>
          </Link>

          <Bay side="right" label="Sharing plates" photo="kitchen" position="58% 56%" />

          {event && (
            <button type="button" className="aboard" onClick={() => goto('on')}>
              <span className="aboard__when">{event.when}</span>
              <span className="aboard__what">{event.title}</span>
              <span className="sr-only">: see what's on</span>
            </button>
          )}
        </div>
      </div>

      <div className="sf__pavement" aria-hidden="true" />
    </section>
  )
}

/** Five taps on the glass inside a second wakes whoever's in the window. */
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

function Bay({ side, label, photo, position, egg }: { side: 'left' | 'right'; label: string; photo: ImageKey; position: string; egg?: boolean }) {
  const { up, knock } = useKnock()
  return (
    <>
      <div className={`awning awning--${side}`} aria-hidden="true">
        <span className="awning__face" />
        <span className="awning__valance">{label}</span>
      </div>
      <div className={`window window--${side}`} onPointerDown={egg ? knock : undefined}>
        <Img k={photo} priority sizes={side === 'left' ? '(min-width: 900px) 20vw, 46vw' : '28vw'} position={position} />
        {egg && <Pomsky up={up} />}
        <span className="window__bars" aria-hidden="true" />
        {egg && <PomskyWoof up={up} />}
      </div>
      <span className={`planter planter--${side}`} aria-hidden="true">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none">
          <path d={GRASS} />
        </svg>
      </span>
    </>
  )
}

/* Fountain grass, as one flat silhouette: a row of tufts, each a fan of blades. */
const GRASS = [16, 50, 84, 118, 152, 186]
  .map((x, t) => {
    const h = 30 + ((t * 7) % 9)
    const blades = [-1, -0.55, -0.2, 0.15, 0.5, 0.95]
    return blades
      .map((b) => {
        const tipX = x + b * 22
        const tipY = 40 - h * (1 - Math.abs(b) * 0.28)
        return `M${x - 2} 40 Q ${x + b * 6} ${40 - h * 0.6} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${x + b * 3} ${40 - h * 0.5} ${x + 2} 40 Z`
      })
      .join(' ')
  })
  .join(' ')
