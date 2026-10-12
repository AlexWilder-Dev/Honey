import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type SectionId = 'eat' | 'drink' | 'spaces' | 'find'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
}

/** Jump to a section on the home page, from anywhere (the hash belongs to the router). */
export function useGoto() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return useCallback(
    (id: SectionId) => {
      if (pathname === '/') scrollToSection(id)
      else navigate('/', { state: { section: id } })
    },
    [navigate, pathname],
  )
}
