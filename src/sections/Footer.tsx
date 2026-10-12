import { Link } from 'react-router-dom'
import { Monogram } from '../components/Monogram'
import { venue } from '../data/venue'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__row">
        <Monogram className="footer__mono" />
        <p className="footer__strap">{venue.strapline}</p>
        <p className="footer__line">
          {venue.name} · {venue.street}, {venue.city} {venue.postcode} · <a href={venue.phoneHref}>{venue.phone}</a>
        </p>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/menu">Menu</Link>
          <Link to="/christmas">Christmas</Link>
          <a href={venue.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </div>
      <p className="wrap footer__credit">Site by AlexWilder-Dev</p>
    </footer>
  )
}
