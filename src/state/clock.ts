import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { londonParts, overrideFromLocation, statusAt, type Moment } from '../lib/time'

/** The venue's clock, ticking every 30s, or a fixed demo moment from ?at=. */
export function useVenueClock() {
  useLocation() // re-read when the route changes, since ?at= can live inside the hash
  const [, setTick] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000)
    return () => window.clearInterval(t)
  }, [])

  const override = overrideFromLocation()
  const { day, minutes } = londonParts()
  const moment: Moment = override ?? { day, minutes }
  return { moment, status: statusAt(moment), demo: !!override }
}
