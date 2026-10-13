import { AnimatePresence, m } from 'framer-motion'
import { Link } from 'react-router-dom'
import { money, plural } from '../lib/format'
import { snap } from '../lib/motion'
import { useTable, type TableLine } from '../state/table'
import { useUi } from '../state/ui'
import { Sheet, SheetClose } from './Sheet'

/** Floating summary of the table you're building. */
export function TablePill() {
  const { count, total } = useTable()
  const { openTable, panel } = useUi()
  const show = count.all > 0 && panel === null
  return (
    <AnimatePresence>
      {show && (
        <m.button
          type="button"
          className="pill"
          onClick={openTable}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
          transition={snap}
          aria-label={`Your table: ${plural(count.plates, 'plate')} and ${plural(count.glasses, 'glass', 'glasses')}, ${money(total)}. Open`}
        >
          <span className="pill__label">Your table</span>
          <m.span className="pill__count" key={count.all} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={snap}>
            {count.plates} <small>{count.plates === 1 ? 'plate' : 'plates'}</small> · {count.glasses}{' '}
            <small>{count.glasses === 1 ? 'glass' : 'glasses'}</small>
          </m.span>
          <span className="pill__total">{money(total)}</span>
        </m.button>
      )}
    </AnimatePresence>
  )
}

function Column({ title, lines, empty }: { title: string; lines: TableLine[]; empty: string }) {
  const { change } = useTable()
  const subtotal = lines.reduce((n, l) => n + l.qty * l.amount, 0)
  return (
    <div className="tray__col">
      <h3 className="tray__head">
        <span>{title}</span>
        <span>{money(subtotal)}</span>
      </h3>
      {lines.length === 0 ? (
        <p className="tray__empty">{empty}</p>
      ) : (
        <ul className="tray__list">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <m.li
                key={l.key}
                className="tray__line"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={snap}
              >
                <span className="tray__name">
                  {l.name}
                  {l.label && <small> {l.label.toLowerCase()}</small>}
                </span>
                <span className="tray__qty">
                  <button type="button" onClick={() => change(l.key, -1)} aria-label={`One less ${l.name}`}>
                    −
                  </button>
                  <span aria-label={`${l.qty} ${l.name}`}>{l.qty}</span>
                  <button type="button" onClick={() => change(l.key, 1)} aria-label={`One more ${l.name}`}>
                    +
                  </button>
                </span>
                <span className="tray__price">{money(l.qty * l.amount)}</span>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

export function TableSheet() {
  const { plates, glasses, total, count, clear } = useTable()
  const { panel, close, openBooking } = useUi()
  return (
    <Sheet open={panel === 'table'} onClose={close} label="Your table" className="sheet--tray">
      <SheetClose onClose={close} />
      <header className="sheet__top">
        <h2 className="title sheet__title">Your table</h2>
        <p className="sheet__sub">
          {count.all
            ? 'Plates on one side, glasses on the other. Book, and it goes in the email so the kitchen and bar know what you’re after.'
            : 'Nothing on it yet. Tap + on any plate or glass to start building.'}
        </p>
      </header>
      <div className="tray">
        <Column title="Plates" lines={plates} empty="No plates yet." />
        <Column title="Glasses" lines={glasses} empty="No glasses yet." />
      </div>
      <footer className="sheet__foot">
        <p className="tray__total">
          <span>Total, as listed</span>
          <strong>{money(total)}</strong>
        </p>
        {count.all > 0 ? (
          <div className="sheet__actions">
            <button type="button" className="btn btn--yellow" onClick={() => openBooking()} data-autofocus>
              Book this table
            </button>
            <button type="button" className="link" onClick={clear}>
              Clear the table
            </button>
          </div>
        ) : (
          <div className="sheet__actions">
            <Link to="/menu" className="btn btn--yellow" onClick={close}>
              Open the menu
            </Link>
          </div>
        )}
      </footer>
    </Sheet>
  )
}
