import { Link } from 'react-router-dom'
import { venue } from '../data/venue'
import { useUi } from '../state/ui'

/** Phones only: the three things people come for. */
export function BottomBar() {
  const { openBooking } = useUi()
  return (
    <nav className="bottombar" aria-label="Quick actions">
      <button type="button" className="bottombar__book" onClick={() => openBooking()}>
        Book a table
      </button>
      <Link to="/menu" className="bottombar__item">
        Menu
      </Link>
      <a className="bottombar__item" href={venue.directions} target="_blank" rel="noreferrer">
        Directions
      </a>
    </nav>
  )
}
