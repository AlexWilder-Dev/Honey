import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Seat = '' | 'The courtyard' | 'Upstairs'
export type BookingPreset = { seat?: Seat; occasion?: string }
type Panel = null | 'booking' | 'table' | 'nav'

type Ctx = {
  panel: Panel
  preset: BookingPreset
  openBooking: (preset?: BookingPreset) => void
  openTable: () => void
  openNav: () => void
  close: () => void
}

const UiContext = createContext<Ctx | null>(null)

/** Which sheet is open. Only one at a time, so they never stack. */
export function UiProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null)
  const [preset, setPreset] = useState<BookingPreset>({})

  const openBooking = useCallback((p: BookingPreset = {}) => {
    setPreset(p)
    setPanel('booking')
  }, [])
  const openTable = useCallback(() => setPanel('table'), [])
  const openNav = useCallback(() => setPanel('nav'), [])
  const close = useCallback(() => setPanel(null), [])

  const value = useMemo(() => ({ panel, preset, openBooking, openTable, openNav, close }), [panel, preset, openBooking, openTable, openNav, close])
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi outside UiProvider')
  return ctx
}
