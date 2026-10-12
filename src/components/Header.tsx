import { Link } from 'react-router-dom'
import { useUi } from '../state/ui'
import { useGoto } from '../lib/nav'
import { Wordmark } from './Wordmark'
import { RightNow } from './RightNow'

export function Header() {
  const { openBooking, openNav } = useUi()
  const goto = useGoto()
  return (
    <header className="header">
      <div className="header__row">
        <Link to="/" className="header__brand" aria-label="Hive & Honey, home">
          <Wordmark />
        </Link>
        <nav className="header__nav" aria-label="Main">
          <button type="button" onClick={() => goto('eat')}>Eat</button>
          <button type="button" onClick={() => goto('drink')}>Drink</button>
          <button type="button" onClick={() => goto('spaces')}>Spaces</button>
          <button type="button" onClick={() => goto('find')}>Find us</button>
          <Link to="/menu">Menu</Link>
        </nav>
        <RightNow className="header__now" />
        <button type="button" className="btn btn--door btn--small header__book" onClick={() => openBooking()}>
          Book a table
        </button>
        <button type="button" className="header__burger" onClick={openNav} aria-label="Open navigation">
          <span />
          <span />
        </button>
      </div>
      <div className="header__strip">
        <RightNow />
      </div>
    </header>
  )
}
