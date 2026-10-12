import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from '../lib/nav'
import { Drink } from '../sections/Drink'
import { Eat } from '../sections/Eat'
import { FindUs } from '../sections/FindUs'
import { Hero } from '../sections/Hero'
import { Pair } from '../sections/Pair'
import { Reviews } from '../sections/Reviews'
import { Spaces } from '../sections/Spaces'

export function Home() {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const section = (state as { section?: string } | null)?.section

  useEffect(() => {
    if (!section) return
    const t = window.setTimeout(() => {
      scrollToSection(section)
      navigate(pathname, { replace: true, state: null })
    }, 80)
    return () => window.clearTimeout(t)
  }, [section, navigate, pathname])

  return (
    <>
      <Hero />
      <Pair />
      <Eat />
      <Drink />
      <Spaces />
      <Reviews />
      <FindUs />
    </>
  )
}
