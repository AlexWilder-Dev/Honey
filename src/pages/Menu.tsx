import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { menu, menuTagline } from '../data/menu'
import { pour } from '../lib/motion'

export function Menu() {
  const { tab = 'plates' } = useParams()
  const navigate = useNavigate()
  const tabs = useRef<HTMLDivElement>(null)
  const current = menu.find((t) => t.id === tab)

  useEffect(() => {
    document.title = 'Menu · Hive & Honey · Leicester'
    return () => {
      document.title = 'Hive & Honey · Leicester'
    }
  }, [])

  if (!current) return <Navigate to="/menu" replace />

  const go = (id: string, focus = false) => {
    navigate(`/menu/${id}`, { replace: true })
    if (focus) requestAnimationFrame(() => tabs.current?.querySelector<HTMLButtonElement>(`#tab-${id}`)?.focus())
  }

  const onKey = (e: KeyboardEvent) => {
    const i = menu.findIndex((t) => t.id === tab)
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: menu.length - 1 - i }[e.key]
    if (step === undefined) return
    e.preventDefault()
    go(menu[(i + step + menu.length) % menu.length].id, true)
  }

  const plates = menu.filter((t) => t.kind === 'plate')
  const glasses = menu.filter((t) => t.kind === 'glass')
  const tabButton = (t: (typeof menu)[number]) => (
    <button
      key={t.id}
      id={`tab-${t.id}`}
      type="button"
      role="tab"
      aria-selected={t.id === tab}
      aria-controls="menu-panel"
      tabIndex={t.id === tab ? 0 : -1}
      className={`tabs__tab ${t.id === tab ? 'is-on' : ''}`}
      onClick={() => go(t.id)}
    >
      {t.label}
    </button>
  )

  return (
    <main className="menu on-paper" id="main">
      <header className="wrap menu__head">
        <p className="kicker">The menu</p>
        <h1 className="display title menu__title">
          Plates <span className="amp">&amp;</span> glasses
        </h1>
        <p className="lede">{menuTagline}.</p>
        <p className="menu__how">
          Tap <span className="course__plus" aria-hidden="true">+</span> on anything to put it on your table, then book it in one go. V means vegetarian. Allergies or
          dietary needs? Have a word with the team before you order.
        </p>
      </header>

      <div className="tabs-bar">
        <div className="wrap">
          <div className="tabs" role="tablist" aria-label="Menu sections" ref={tabs} onKeyDown={onKey}>
            <div className="tabs__group">{plates.map(tabButton)}</div>
            <span className="tabs__amp amp" aria-hidden="true">
              &amp;
            </span>
            <div className="tabs__group">{glasses.map(tabButton)}</div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className={`menu__panel menu__panel--${current.sections.length > 1 ? 'many' : 'one'}`}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={pour}
          >
            {current.sections.map((s) => (
              <section key={s.id} className="menu__section" aria-labelledby={`sec-${s.id}`}>
                <h2 className="menu__section-title" id={`sec-${s.id}`}>
                  {s.title}
                </h2>
                <ul className="dishes">
                  {s.items.map((it) => (
                    <DishRow key={it.id} item={it} />
                  ))}
                </ul>
              </section>
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
