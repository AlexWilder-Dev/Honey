import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from '../lib/nav'
import { Drink } from '../sections/Drink'
import { Eat } from '../sections/Eat'
import { Press } from '../sections/Press'
import { Hero } from '../sections/Hero'
import { Intro } from '../sections/Intro'
import { Interlude } from '../sections/Interlude'
import { Spaces } from '../sections/Spaces'
import { Visit } from '../sections/Visit'
import { WhatsOn } from '../sections/WhatsOn'

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
      <Intro />
      <Eat />
      <Drink />
      <Interlude />
      <Spaces />
      <WhatsOn />
      <Press />
      <Visit />
    </>
  )
}
