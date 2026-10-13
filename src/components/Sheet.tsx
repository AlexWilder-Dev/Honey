import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { snap } from '../lib/motion'
import { NARROW, useMedia } from '../lib/useMedia'

type Props = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
  tone?: 'dark' | 'light'
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'

/** A dialog that pours in from the side (or from below on phones). */
export function Sheet({ open, onClose, label, children, className = '', tone = 'dark' }: Props) {
  const narrow = useMedia(NARROW)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'

    const t = window.setTimeout(() => {
      const el = panel.current
      const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el
      first?.focus({ preventScroll: true })
    }, 40)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prev
      before?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  const from = narrow ? { y: 48, opacity: 0 } : { x: 40, opacity: 0 }
  const to = narrow ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }

  return (
    <AnimatePresence>
      {open && (
        <div className="sheet-layer">
          <m.div
            className="sheet-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={`sheet ${tone === 'light' ? 'on-light' : 'on-dark'} ${className}`}
            initial={from}
            animate={to}
            exit={{ ...from, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            transition={snap}
          >
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function SheetClose({ onClose, label = 'Close' }: { onClose: () => void; label?: string }) {
  return (
    <button type="button" className="sheet__close" onClick={onClose} aria-label={label}>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}
