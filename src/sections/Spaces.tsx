import { m } from 'framer-motion'
import { useState } from 'react'
import { Img } from '../components/Img'
import { Pour } from '../components/Pour'
import { pour } from '../lib/motion'
import { NARROW, useMedia } from '../lib/useMedia'
import { useUi, type Seat } from '../state/ui'

type Side = 'day' | 'evening'

/** Courtyard by day, upstairs by evening: whichever you lean towards opens up a little. */
export function Spaces() {
  const { openBooking } = useUi()
  const narrow = useMedia(NARROW)
  const [lean, setLean] = useState<Side | null>(null)
  const grow = (s: Side) => (narrow || !lean ? 1 : lean === s ? 1.32 : 0.86)

  const half = (s: Side, seat: Seat, children: React.ReactNode) => (
    <m.div
      className={`spaces__half spaces__half--${s} ${s === 'day' ? 'on-paper' : 'on-night'}`}
      animate={{ flexGrow: grow(s) }}
      transition={pour}
      onPointerEnter={() => setLean(s)}
      onFocus={() => setLean(s)}
    >
      {children}
      <button type="button" className="text-link spaces__book" onClick={() => openBooking(seat)}>
        {s === 'day' ? 'Book the courtyard' : 'Book upstairs'} <span className="arrow">→</span>
      </button>
    </m.div>
  )

  return (
    <section id="spaces" className="spaces" aria-labelledby="spaces-title" onPointerLeave={() => setLean(null)}>
      <h2 className="sr-only" id="spaces-title">
        The courtyard and upstairs
      </h2>
      {half(
        'day',
        'The courtyard',
        <>
          <Pour className="spaces__photos">
            <Img k="courtyard-day" sizes="(min-width: 900px) 46vw, 92vw" position="40% 60%" className="spaces__main" />
            <Img k="palms" sizes="(min-width: 900px) 14vw, 34vw" position="50% 30%" className="spaces__inset" />
          </Pour>
          <Pour className="spaces__text" delay={0.1}>
            <p className="kicker">By day</p>
            <h3 className="display spaces__title">The courtyard</h3>
            <p className="body">
              A hideaway from the city centre, round the back. Palms, green chairs, sun on old brick. Made for a quick drink that turns into lunch.
            </p>
          </Pour>
        </>,
      )}
      <p className="spaces__amp amp" aria-hidden="true">
        &amp;
      </p>
      {half(
        'evening',
        'Upstairs',
        <>
          <Pour className="spaces__photos">
            <Img k="upstairs" lit sizes="(min-width: 900px) 46vw, 92vw" position="50% 55%" className="spaces__main" />
            <Img k="upstairs-room" lit sizes="(min-width: 900px) 14vw, 34vw" position="40% 50%" className="spaces__inset" />
          </Pour>
          <Pour className="spaces__text" delay={0.1}>
            <p className="kicker">By evening</p>
            <h3 className="display spaces__title">Upstairs</h3>
            <p className="body">
              The upstairs bar and dining room, candlelit once the sun's gone. For a slower, more intimate dinner.
            </p>
          </Pour>
        </>,
      )}
    </section>
  )
}
