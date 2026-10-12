import { LazyMotion, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BottomBar } from './components/BottomBar'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { TablePill, TableSheet } from './components/TableTray'
import { Home } from './pages/Home'
import { Footer } from './sections/Footer'
import { TableProvider, useTable } from './state/table'
import { UiProvider, useUi } from './state/ui'

const Menu = lazy(() => import('./pages/Menu').then((m) => ({ default: m.Menu })))
const BookingSheet = lazy(() => import('./components/BookingSheet').then((m) => ({ default: m.BookingSheet })))
const motionFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

/** The booking sheet's code only loads once someone reaches for it. */
function Booking() {
  const { panel } = useUi()
  const [wanted, setWanted] = useState(false)
  useEffect(() => {
    if (panel === 'booking') setWanted(true)
  }, [panel])
  return wanted || panel === 'booking' ? (
    <Suspense fallback={null}>
      <BookingSheet />
    </Suspense>
  ) : null
}

function ScrollToTop() {
  const { pathname, state } = useLocation()
  const top = pathname.split('/')[1]
  useEffect(() => {
    if (!(state as { section?: string } | null)?.section) window.scrollTo(0, 0)
  }, [top]) // only when moving between pages, not on every hash change
  return null
}

function Announcer() {
  const { announcement } = useTable()
  return (
    <p className="sr-only" aria-live="polite" role="status">
      {announcement}
    </p>
  )
}

export function App() {
  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={motionFeatures} strict>
          <UiProvider>
            <TableProvider>
              <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
                Skip to content
              </a>
              <ScrollToTop />
              <Header />
              <Routes>
                <Route path="/" element={<main id="main" tabIndex={-1}><Home /></main>} />
                <Route path="/menu" element={<Suspense fallback={<main className="menu on-paper" />}><Menu /></Suspense>} />
                <Route path="/menu/:tab" element={<Suspense fallback={<main className="menu on-paper" />}><Menu /></Suspense>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
              <TablePill />
              <BottomBar />
              <TableSheet />
              <Booking />
              <MobileNav />
              <Announcer />
            </TableProvider>
          </UiProvider>
        </LazyMotion>
      </MotionConfig>
    </HashRouter>
  )
}
