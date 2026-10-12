import { Link } from 'react-router-dom'
import { venue } from '../data/venue'
import { useGoto, type SectionId } from '../lib/nav'
import { useUi } from '../state/ui'
import { Sheet, SheetClose } from './Sheet'

const links: [SectionId, string][] = [
  ['on', 'What’s on'],
  ['eat', 'Eat'],
  ['drink', 'Drink'],
  ['house', 'The house'],
  ['visit', 'Visit'],
]

export function MobileNav() {
  const { panel, close, openBooking } = useUi()
  const goto = useGoto()
  return (
    <Sheet open={panel === 'nav'} onClose={close} label="Navigation" className="sheet--nav">
      <SheetClose onClose={close} />
      <nav className="mnav" aria-label="Main">
        {links.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="mnav__link"
            onClick={() => {
              close()
              window.setTimeout(() => goto(id), 60)
            }}
          >
            {label}
          </button>
        ))}
        <Link to="/menu" className="mnav__link" onClick={close}>
          The full menu
        </Link>
        <Link to="/christmas" className="mnav__link" onClick={close}>
          Christmas
        </Link>
      </nav>
      <div className="mnav__foot">
        <button type="button" className="btn btn--yellow" onClick={() => openBooking()}>
          Book a table
        </button>
        <p>
          <a href={venue.phoneHref}>{venue.phone}</a>
          <br />
          <a href={`mailto:${venue.email}`}>{venue.email}</a>
        </p>
      </div>
    </Sheet>
  )
}
