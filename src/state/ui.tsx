import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Seat = '' | 'The courtyard' | 'Upstairs'
type Panel = null | 'booking' | 'table' | 'nav'

type Ctx = {
  panel: Panel
  seat: Seat
  openBooking: (seat?: Seat) => void
  openTable: () => void
  openNav: () => void
  close: () => void
}

const UiContext = createContext<Ctx | null>(null)

/** Which sheet is open. Only one at a time, so they never stack. */
export function UiProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null)
  const [seat, setSeat] = useState<Seat>('')

  const openBooking = useCallback((s: Seat = '') => {
    setSeat(s)
    setPanel('booking')
  }, [])
  const openTable = useCallback(() => setPanel('table'), [])
  const openNav = useCallback(() => setPanel('nav'), [])
  const close = useCallback(() => setPanel(null), [])

  const value = useMemo(() => ({ panel, seat, openBooking, openTable, openNav, close }), [panel, seat, openBooking, openTable, openNav, close])
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi outside UiProvider')
  return ctx
}
