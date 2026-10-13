import { useEffect, useRef, useState } from 'react'
import { Img } from '../components/Img'
import { Pomsky, PomskyWoof } from '../components/Pomsky'
import { upcoming } from '../data/events'
import { venue } from '../data/venue'
import { useGoto, type SectionId } from '../lib/nav'
import { seasonLine } from '../lib/time'
import { useVenueClock } from '../state/clock'
import { useUi } from '../state/ui'

/**
 * The landing page as a magazine cover: dateline, masthead, one cover
 * photograph, and cover lines that are also the way into the site.
 */
export function Cover() {
  const { openBooking } = useUi()
  const { status, demo } = useVenueClock()
  const goto = useGoto()
  const { up, knock } = useKnock()

  const diary = upcoming().map((e) => e.short)
  const diaryLine = diary.length > 1 ? `${diary.slice(0, -1).join(', ')} and ${diary.at(-1)}.` : `${diary[0] ?? 'The last-Friday DJ in the courtyard'}.`
  const lines: { id: SectionId; kicker: string; line: string }[] = [
    { id: 'eat', kicker: 'Eat', line: 'Salt cod pakora, a wagyu anticucho bite and a Red Leicester terrine, from the team behind Dom.' },
    { id: 'drink', kicker: 'Drink', line: 'Rhubarb milk punch, a fat-washed bourbon sour and a martini finished with pickled onion brine.' },
    { id: 'on', kicker: 'Diary', line: diaryLine.charAt(0).toUpperCase() + diaryLine.slice(1) },
    { id: 'house', kicker: 'The house', line: 'A Georgian front, a courtyard of palms, and a timber-framed wing that’s older still.' },
  ]

  return (
    <section className="cover" aria-labelledby="cover-title">
      <div className="wrap">
        <p className="cover__dateline label">
          <span>No. 42 Silver Street</span>
          <span className="cover__dateline-mid">Leicester Old Town</span>
          <span>{seasonLine()}</span>
        </p>

        <h1 className="cover__mast" id="cover-title">
          Hive <em>&amp;</em> Honey
        </h1>

        <p className="cover__strap label">
          <span>Cocktail bar &amp; sharing plates</span>
          <span className="cover__strapline">{venue.strapline}</span>
          <span>Est. {venue.opened}</span>
        </p>

        <div className="cover__body">
          <figure className="cover__photo">
            <div className="cover__frame" onPointerDown={knock}>
              <Img k="courtyard-crowd" priority sizes="(min-width: 900px) 62vw, 100vw" position="50% 64%" />
              <Pomsky up={up} />
              <PomskyWoof up={up} />
            </div>
            <figcaption className="caption">
              <b>The courtyard.</b> An evening out the back of No. 42, under the festoon lights and the old brick wing.
            </figcaption>
          </figure>

          <div className="cover__side">
            <div className="cover__tonight">
              <span className="label">{status.barOpen ? 'Open now' : 'Right now'}</span>
              <p className="cover__status">
                {status.line.split(' · ').map((part, i) => (
                  <span key={part}>
                    {i === 0 && <span className={`dot dot--${status.tone}`} aria-hidden="true" />}
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                    {i === 0 && demo && <span className="cover__demo">demo time</span>}
                  </span>
                ))}
              </p>
              <div className="cover__actions">
                <button type="button" className="btn btn--black" onClick={() => openBooking()}>
                  Book a table
                </button>
                <span className="cover__walkin">or just walk in</span>
              </div>
            </div>

            <nav className="cover__lines" aria-label="In this issue">
              {lines.map((l, i) => (
                <button key={l.id} type="button" className="cover__line" onClick={() => goto(l.id)}>
                  <span className="cover__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="label cover__kicker">{l.kicker}</span>
                  <span className="cover__text">{l.line}</span>
                </button>
              ))}
            </nav>
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
