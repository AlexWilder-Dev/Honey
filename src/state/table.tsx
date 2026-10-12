import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { byId, type Kind } from '../data/menu'
import { money } from '../lib/format'

/** One line on the tray: a menu item at one of its prices (glass or bottle, half or pint). */
export type TableLine = {
  key: string
  id: string
  priceIndex: number
  qty: number
  name: string
  label?: string
  amount: number
  kind: Kind
}

type Ctx = {
  lines: TableLine[]
  plates: TableLine[]
  glasses: TableLine[]
  count: { plates: number; glasses: number; all: number }
  total: number
  add: (id: string, priceIndex?: number) => void
  change: (key: string, delta: number) => void
  clear: () => void
  qtyOf: (id: string, priceIndex?: number) => number
  announcement: string
}

const TableContext = createContext<Ctx | null>(null)
const STORE = 'hh-table'
type Saved = Record<string, number> // "id:priceIndex" → qty

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORE)
    const parsed = raw ? (JSON.parse(raw) as Saved) : {}
    return Object.fromEntries(Object.entries(parsed).filter(([k, q]) => byId.has(k.split(':')[0]) && q > 0))
  } catch {
    return {}
  }
}

export function TableProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(saved))
    } catch {
      /* private mode: the tray just won't persist */
    }
  }, [saved])

  const lines = useMemo<TableLine[]>(
    () =>
      Object.entries(saved).flatMap(([key, qty]) => {
        const [id, pi] = key.split(':')
        const entry = byId.get(id)
        if (!entry) return []
        const price = entry.item.prices[Number(pi)] ?? entry.item.prices[0]
        return [{ key, id, priceIndex: Number(pi), qty, name: entry.item.name, label: price.label, amount: price.amount, kind: entry.kind }]
      }),
    [saved],
  )

  const add = useCallback((id: string, priceIndex = 0) => {
    const key = `${id}:${priceIndex}`
    setSaved((s) => ({ ...s, [key]: (s[key] ?? 0) + 1 }))
    const e = byId.get(id)
    if (e) {
      const p = e.item.prices[priceIndex]
      setAnnouncement(`Added ${e.item.name}${p?.label ? `, ${p.label.toLowerCase()}` : ''}, ${money(p?.amount ?? 0)}, to your table`)
    }
  }, [])

  const change = useCallback((key: string, delta: number) => {
    setSaved((s) => {
      const next = { ...s }
      const q = (next[key] ?? 0) + delta
      if (q <= 0) delete next[key]
      else next[key] = q
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setSaved({})
    setAnnouncement('Your table is clear')
  }, [])

  const value = useMemo<Ctx>(() => {
    const plates = lines.filter((l) => l.kind === 'plate')
    const glasses = lines.filter((l) => l.kind === 'glass')
    const sum = (ls: TableLine[]) => ls.reduce((n, l) => n + l.qty, 0)
    return {
      lines,
      plates,
      glasses,
      count: { plates: sum(plates), glasses: sum(glasses), all: sum(lines) },
      total: lines.reduce((n, l) => n + l.qty * l.amount, 0),
      add,
      change,
      clear,
      qtyOf: (id, priceIndex) =>
        priceIndex === undefined
          ? lines.filter((l) => l.id === id).reduce((n, l) => n + l.qty, 0)
          : saved[`${id}:${priceIndex}`] ?? 0,
      announcement,
    }
  }, [lines, add, change, clear, saved, announcement])

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

export function useTable() {
  const ctx = useContext(TableContext)
  if (!ctx) throw new Error('useTable outside TableProvider')
  return ctx
}
