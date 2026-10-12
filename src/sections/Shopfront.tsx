import { m } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Img, type ImageKey } from '../components/Img'
import { RightNow } from '../components/RightNow'
import { Wordmark } from '../components/Wordmark'
import { nextEvent } from '../data/events'
import { pour } from '../lib/motion'
import { hoursSummary, serviceMoment } from '../lib/time'
import { useVenueClock } from '../state/clock'
import { useUi } from '../state/ui'
import { useGoto } from '../lib/nav'

/**
 * The front of 42 Silver Street as the way in: black render, yellow awnings,
 * Georgian glazing bars with the bar and kitchen behind them, the yellow door
 * in its stone doorcase, and the lit menu case beside it.
 */
export function Shopfront() {
  const { openBooking } = useUi()
  const { moment } = useVenueClock()
  const today = hoursSummary(serviceMoment(moment).day)
  const event = nextEvent()
  const goto = useGoto()

  return (
    <section className="sf" aria-labelledby="sf-title">
      <h1 id="sf-title" className="sr-only">
        Hive &amp; Honey: cocktail bar and sharing plates at 42 Silver Street, Leicester
      </h1>

      <div className="sf__brick" aria-hidden="true">
        <span className="sash" />
        <span className="sash" />
        <span className="sash" />
      </div>

      <div className="sf__ground">
        <m.div
          className="sign"
          aria-hidden="true"
          initial={{ rotate: -7 }}
          animate={{ rotate: 0 }}
          transition={{ ...pour, delay: 0.4 }}
        >
          <span className="sign__bracket" />
          <span className="sign__board">
            <Wordmark />
          </span>
        </m.div>

        <Bay side="left" label="Cocktails" photo="hero-glass" position="34% 48%" lights={2} />

        <div className="portico">
          <span className="portico__cornice" aria-hidden="true" />
          <span className="portico__frieze" aria-hidden="true" />
          <div className="portico__body">
            <span className="column" aria-hidden="true" />
            <button type="button" className="door" onClick={() => openBooking()}>
              <span className="door__light" aria-hidden="true" />
              <span className="door__transom" aria-hidden="true" />
              <span className="door__leaf door__leaf--l" aria-hidden="true" />
              <span className="door__leaf door__leaf--r" aria-hidden="true" />
              <span className="door__plate">Book a table</span>
            </button>
            <span className="column" aria-hidden="true" />
          </div>
          <span className="portico__step" aria-hidden="true" />
        </div>

        <div className="case">
          <span className="case__lamp" aria-hidden="true" />
          <CaseGlass bar={today.bar} kitchen={today.kitchen} />
        </div>

        <Bay side="right" label="Sharing plates" photo="kitchen" position="60% 55%" lights={4} />
      </div>

      <div className="sf__pavement">
        <button type="button" className="aboard" onClick={() => goto('on')}>
          <span className="aboard__poster">
            {event ? (
              <>
                <span className="aboard__when">{event.when}</span>
                <span className="aboard__what">{event.title}</span>
                <span className="aboard__time">{event.time}</span>
              </>
            ) : (
              <span className="aboard__what">Walk-ins welcome</span>
            )}
          </span>
          <span className="sr-only">What's on</span>
        </button>
      </div>

      <div className="sf__case-m">
        <CaseGlass bar={today.bar} kitchen={today.kitchen} />
      </div>
    </section>
  )
}

/** The lit case by the door, where the menu and today's hours live. */
function CaseGlass({ bar, kitchen }: { bar: string; kitchen: string }) {
  return (
    <div className="case__glass">
      <p className="case__label">Right now</p>
      <RightNow />
      <dl className="case__hours">
        <dt>Bar</dt>
        <dd>{bar}</dd>
        <dt>Kitchen</dt>
        <dd>{kitchen}</dd>
      </dl>
      <Link to="/menu" className="case__menu">
        Read the menu →
      </Link>
    </div>
  )
}

function Bay({ side, label, photo, position, lights }: { side: 'left' | 'right'; label: string; photo: ImageKey; position: string; lights: number }) {
  return (
    <div className={`bay bay--${side}`}>
      <div className="awning" aria-hidden="true">
        <span className="awning__top" />
        <span className="awning__valance">{label}</span>
      </div>
      <div className="window" style={{ ['--lights' as string]: lights }}>
        <Img k={photo} priority sizes={side === 'left' ? '(min-width: 900px) 26vw, 52vw' : '40vw'} position={position} />
        <span className="window__bars" aria-hidden="true">
          {Array.from({ length: lights }, (_, i) => (
            <span key={i} />
          ))}
        </span>
      </div>
      <span className="planter" aria-hidden="true">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          {Array.from({ length: 90 }, (_, i) => {
            // ornamental grass: soft arching blades, denser in the middle of each clump
            const clump = Math.floor(i / 15)
            const x = 14 + clump * 34 + ((i * 7) % 15) - 7
            const h = 18 + ((i * 37) % 26)
            const lean = (((i * 13) % 23) - 11) * 1.4
            return <path key={i} d={`M${x} 60 Q ${x + lean * 0.2} ${60 - h * 0.7} ${x + lean} ${60 - h}`} />
          })}
        </svg>
      </span>
    </div>
  )
}
