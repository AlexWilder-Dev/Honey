import { Link } from 'react-router-dom'
import { Monogram } from '../components/Monogram'
import { Wordmark } from '../components/Wordmark'
import { venue } from '../data/venue'
import { useUi } from '../state/ui'

/** Signs off the way their printed menus do: monogram, wordmark, address. */
export function Footer() {
  const { openBooking } = useUi()
  return (
    <footer className="footer on-night">
      <div className="wrap footer__sign">
        <Monogram className="footer__mono" />
        <Wordmark className="footer__wm" />
        <p className="footer__addr">
          {venue.street}, {venue.city} {venue.postcode}
          <br />
          <a href={venue.phoneHref}>{venue.phone}</a> · <a href={`mailto:${venue.email}`}>{venue.email}</a>
        </p>
        <nav className="footer__links" aria-label="Footer">
          <button type="button" className="text-link" onClick={() => openBooking()}>
            Book a table
          </button>
          <Link to="/menu" className="text-link">
            Menu
          </Link>
          <a className="text-link" href={venue.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </div>
      <p className="wrap footer__base">Site by AlexWilder-Dev</p>
    </footer>
  )
}
