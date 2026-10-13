import { m } from 'framer-motion'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { DishRow } from '../components/DishRow'
import { menu, menuTagline } from '../data/menu'

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

  // keep the chosen tab in view in the scrolling tab bar (phones)
  useEffect(() => {
    tabs.current?.querySelector<HTMLElement>(`#tab-${tab}`)?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])

  if (!current) return <Navigate to="/menu" replace />

  const go = (id: string, focus = false) => {
    navigate(`/menu/${id}`, { replace: true })
    requestAnimationFrame(() => {
      // If you're further down than the start of the list, bring the new list's top up under the tabs.
      const panel = document.getElementById('menu-panel')
      const bar = document.querySelector('.tabs-bar')
      if (panel && bar) {
        const target = panel.getBoundingClientRect().top + window.scrollY - bar.getBoundingClientRect().bottom - 8
        if (window.scrollY > target) window.scrollTo({ top: target })
      }
      if (focus) tabs.current?.querySelector<HTMLButtonElement>(`#tab-${id}`)?.focus()
    })
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
    <main className="menu on-light" id="main">
      <header className="wrap menu__head">
        <p className="kicker-row">
          <span className="no">The menu</span>
          <span>Eat &amp; drink</span>
        </p>
        <h1 className="headline">
          Small plates, pizzas <em>&amp; the Hive List</em>
        </h1>
        <p className="standfirst">“{menuTagline}.”</p>
        <p className="menu__how">
          V is vegetarian. Allergies or dietary needs? Have a word with the team before you order.
        </p>
      </header>

      <div className="tabs-bar">
        <div className="wrap">
          <div className="tabs" role="tablist" aria-label="Menu sections" ref={tabs} onKeyDown={onKey}>
            <div className="tabs__group">{plates.map(tabButton)}</div>
            <span className="tabs__sep" aria-hidden="true" />
            <div className="tabs__group">{glasses.map(tabButton)}</div>
          </div>
          <Link to="/christmas" className="tabs__xmas">
            Christmas menu →
          </Link>
        </div>
      </div>

      <div className="wrap">
        <m.div
            key={current.id}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className={`menu__panel menu__panel--${current.sections.length > 1 ? 'many' : 'one'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
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
      </div>
    </main>
  )
}
