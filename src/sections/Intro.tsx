import { RightNow } from '../components/RightNow'
import { useGoto } from '../lib/nav'

export function Intro() {
  const goto = useGoto()
  return (
    <section className="intro" aria-label="About Hive & Honey">
      <div className="wrap intro__grid">
        <p className="intro__statement">
          The bar team from The Gadabout and the kitchen behind Dom, under one roof in Leicester’s Old Town.{' '}
          <span>Proper cocktails, plates for the middle of the table, and a courtyard round the back.</span>
        </p>
        <div className="intro__aside">
          <RightNow showDemo={false} />
          <p>Walk-ins welcome, or book ahead.</p>
          <button type="button" className="link" onClick={() => goto('visit')}>
            Hours &amp; finding us
          </button>
        </div>
      </div>
    </section>
  )
}
