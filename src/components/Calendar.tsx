import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { addDays, isBookable, longDate, monthTitle, sameDay, todayInLondon, weekday, ymdKey, type YMD, BOOKING_HORIZON_DAYS } from '../lib/booking'

type Props = { value: YMD | null; onChange: (d: YMD) => void; labelledBy: string }

const HEAD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Month grid, Monday first. Sundays (closed) and past days can't be picked. */
export function Calendar({ value, onChange, labelledBy }: Props) {
  const today = useMemo(todayInLondon, [])
  const last = useMemo(() => addDays(today, BOOKING_HORIZON_DAYS), [today])
  const [view, setView] = useState(() => ({ y: (value ?? today).y, m: (value ?? today).m }))
  const [focus, setFocus] = useState<YMD>(() => value ?? firstBookable(today))
  const grid = useRef<HTMLDivElement>(null)

  const cells = useMemo(() => {
    const first: YMD = { y: view.y, m: view.m, d: 1 }
    const lead = (weekday(first) + 6) % 7
    const days = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate()
    return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => ({ y: view.y, m: view.m, d: i + 1 }))] as (YMD | null)[]
  }, [view])

  const canPrev = view.y > today.y || view.m > today.m
  const canNext = view.y < last.y || view.m < last.m
  const shift = (n: number) =>
    setView((v) => {
      const t = new Date(Date.UTC(v.y, v.m - 1 + n, 1))
      return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1 }
    })

  const move = (d: YMD) => {
    const t = Date.UTC(d.y, d.m - 1, d.d)
    if (t < Date.UTC(today.y, today.m - 1, today.d) || t > Date.UTC(last.y, last.m - 1, last.d)) return
    setFocus(d)
    if (d.m !== view.m || d.y !== view.y) setView({ y: d.y, m: d.m })
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-day="${ymdKey(d)}"]`)?.focus())
  }

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (step === undefined) return
    e.preventDefault()
    move(addDays(focus, step))
  }

  const focusInView = focus.m === view.m && focus.y === view.y

  return (
    <div className="cal">
      <div className="cal__bar">
        <button type="button" className="cal__nav" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">
          ‹
        </button>
        <p className="cal__month" aria-live="polite">
          {monthTitle({ y: view.y, m: view.m, d: 1 })}
        </p>
        <button type="button" className="cal__nav" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="cal__grid" role="group" aria-labelledby={labelledBy} ref={grid} onKeyDown={onKey}>
        {HEAD.map((h) => (
          <span key={h} className={`cal__head ${h === 'Sun' ? 'cal__head--sun' : ''}`} aria-hidden="true">
            {h.slice(0, 1)}
          </span>
        ))}
        {cells.map((c, i) => {
          if (!c) return <span key={`x${i}`} />
          const ok = isBookable(c)
          const selected = sameDay(c, value)
          const isToday = sameDay(c, today)
          const sunday = weekday(c) === 0
          const tabbable = focusInView ? sameDay(c, focus) : c.d === 1
          return (
            <button
              key={ymdKey(c)}
              type="button"
              data-day={ymdKey(c)}
              className={`cal__day ${selected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''} ${sunday ? 'is-sunday' : ''}`}
              aria-disabled={!ok}
              tabIndex={tabbable ? 0 : -1}
              aria-pressed={selected}
              aria-label={`${longDate(c)}${sunday ? ', closed Sundays' : ok ? '' : ', unavailable'}`}
              onClick={() => {
                setFocus(c)
                if (ok) onChange(c)
              }}
            >
              {c.d}
            </button>
          )
        })}
      </div>
      <p className="cal__key">Closed Sundays.</p>
    </div>
  )
}

function firstBookable(from: YMD) {
  for (let i = 0; i < 14; i++) {
    const d = addDays(from, i)
    if (isBookable(d)) return d
  }
  return from
}
