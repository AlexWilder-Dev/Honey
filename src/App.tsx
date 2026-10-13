import { LazyMotion, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BottomBar } from './components/BottomBar'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { Home } from './pages/Home'
import { Footer } from './sections/Footer'
import { UiProvider, useUi } from './state/ui'

const Menu = lazy(() => import('./pages/Menu').then((m) => ({ default: m.Menu })))
const Christmas = lazy(() => import('./pages/Christmas').then((m) => ({ default: m.Christmas })))
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

export function App() {
  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={motionFeatures} strict>
          <UiProvider>
              <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
                Skip to content
              </a>
              <ScrollToTop />
              <Header />
              <Routes>
                <Route path="/" element={<main id="main" tabIndex={-1}><Home /></main>} />
                <Route path="/menu" element={<Suspense fallback={<main className="menu" />}><Menu /></Suspense>} />
                <Route path="/menu/:tab" element={<Suspense fallback={<main className="menu" />}><Menu /></Suspense>} />
                <Route path="/christmas" element={<Suspense fallback={<main className="xmas on-dark" />}><Christmas /></Suspense>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
              <BottomBar />
              <Booking />
              <MobileNav />
          </UiProvider>
        </LazyMotion>
      </MotionConfig>
    </HashRouter>
  )
}
