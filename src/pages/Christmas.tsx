import { useEffect } from 'react'
import { Img } from '../components/Img'
import { christmas } from '../data/christmas'
import { useUi } from '../state/ui'

export function Christmas() {
  const { openBooking } = useUi()
  const book = () => openBooking({ occasion: 'Christmas menu' })

  useEffect(() => {
    document.title = 'Christmas · Hive & Honey · Leicester'
    return () => {
      document.title = 'Hive & Honey · Leicester'
    }
  }, [])

  return (
    <main className="xmas on-dark" id="main">
      <div className="wrap xmas__grid">
        <div className="xmas__head">
          <span className="eyebrow">Christmas 2026</span>
          <h1 className="title title--xl">Three courses, £{christmas.price}</h1>
          <p className="lead">A head, with a welcome drink to start: a glass of Prosecco, a bottled beer or a soft drink.</p>
          <div className="xmas__actions">
            <button type="button" className="btn btn--yellow" onClick={book}>
              Book your Christmas table
            </button>
          </div>
          <p className="xmas__small">Booking a bigger group? Put the numbers in and add a note; the team will come back to you.</p>
          <Img k="poster-christmas" sizes="(min-width: 900px) 30vw, 80vw" className="xmas__poster" />
        </div>

        <div className="xmas__menu">
          {christmas.courses.map((c) => (
            <section key={c.title} className="xmas__course" aria-labelledby={`xc-${c.title}`}>
              <h2 className="dashed" id={`xc-${c.title}`}>
                {c.title}
              </h2>
              <ul>
                {c.dishes.map((d) => (
                  <li key={d.name}>
                    <h3>{d.name}</h3>
                    <p>{d.with}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="xmas__note">{christmas.note}</p>
          <button type="button" className="btn btn--yellow" onClick={book}>
            Book Christmas
          </button>
        </div>
      </div>
    </main>
  )
}
