import { m } from 'framer-motion'
import { Img } from '../components/Img'
import { RightNow } from '../components/RightNow'
import { useGoto } from '../lib/nav'
import { pour } from '../lib/motion'
import { hoursSummary, serviceMoment } from '../lib/time'
import { useVenueClock } from '../state/clock'
import { useUi } from '../state/ui'

export function Hero() {
  const { openBooking } = useUi()
  const goto = useGoto()
  const { moment } = useVenueClock()
  const today = hoursSummary(serviceMoment(moment).day)

  return (
    <section className="hero on-night" aria-labelledby="hero-title">
      <div className="hero__diptych">
        <m.div className="hero__pane" initial={{ opacity: 0, y: -36 }} animate={{ opacity: 1, y: 0 }} transition={pour}>
          <Img k="hero-glass" priority lit sizes="50vw" position="36% 50%" />
        </m.div>
        <m.div className="hero__pane" initial={{ opacity: 0, y: -36 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.14 }}>
          <Img k="kitchen" priority lit sizes="50vw" position="62% 58%" />
        </m.div>
        <h1 className="hero__title" id="hero-title">
          <m.span className="hero__word hero__word--hive" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.3 }}>
            Hive
          </m.span>
          <m.span className="hero__amp amp" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.62 }}>
            &amp;
          </m.span>
          <m.span className="hero__word hero__word--honey" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.42 }}>
            Honey
          </m.span>
        </h1>
        <p className="hero__caption" aria-hidden="true">
          <span>The bar</span>
          <span>The kitchen</span>
        </p>
      </div>

      <div className="hero__below wrap">
        <m.div className="hero__pitch" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.5 }}>
          <p className="hero__line">Every bite, perfectly paired.</p>
          <p className="hero__sub">
            Sharing plates from Dom's kitchen team, cocktails from The Gadabout's bar team. One house on Silver Street.
          </p>
        </m.div>

        <m.div className="hero__now glass" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...pour, delay: 0.6 }}>
          <p className="kicker">Right now</p>
          <RightNow variant="big" />
          <dl className="hero__today">
            <div>
              <dt>Bar today</dt>
              <dd>{today.bar}</dd>
            </div>
            <div>
              <dt>Kitchen</dt>
              <dd>{today.kitchen}</dd>
            </div>
          </dl>
          <div className="hero__ctas">
            <button type="button" className="btn btn--door" onClick={() => openBooking()}>
              Book a table
            </button>
            <button type="button" className="text-link" onClick={() => goto('eat')}>
              Build your table first <span className="arrow">↓</span>
            </button>
          </div>
        </m.div>
      </div>
    </section>
  )
}
