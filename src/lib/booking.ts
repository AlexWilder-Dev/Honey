import { kitchenHours, venue } from '../data/venue'
import { clock, londonParts } from './time'

export type YMD = { y: number; m: number; d: number }

export const ymdKey = ({ y, m, d }: YMD) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
export const weekday = ({ y, m, d }: YMD) => new Date(Date.UTC(y, m - 1, d)).getUTCDay()
export const addDays = ({ y, m, d }: YMD, n: number): YMD => {
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}
export const sameDay = (a: YMD | null, b: YMD | null) => !!a && !!b && a.y === b.y && a.m === b.m && a.d === b.d

export function todayInLondon(): YMD {
  const p = londonParts()
  return { y: p.year, m: p.month, d: p.date }
}

const fmt = (o: Intl.DateTimeFormatOptions) => (v: YMD) =>
  new Intl.DateTimeFormat('en-GB', { ...o, timeZone: 'UTC' }).format(new Date(Date.UTC(v.y, v.m - 1, v.d)))
export const shortDate = (v: YMD) => `${fmt({ weekday: 'short' })(v)} ${v.d} ${fmt({ month: 'short' })(v)}` // Fri 17 Oct
export const longDate = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export const monthTitle = fmt({ month: 'long', year: 'numeric' })

/**
 * Bookable times sit inside kitchen hours, every half hour,
 * with the last table half an hour before the kitchen closes.
 */
export const LAST_TABLE_BEFORE_CLOSE = 30
export const BOOKING_HORIZON_DAYS = 90

export type Slot = { minutes: number; label: string }
export function slotsFor(date: YMD, lead = 30): { lunch: Slot[]; dinner: Slot[] } {
  const services = kitchenHours[weekday(date)]
  const today = todayInLondon()
  const now = sameDay(date, today) ? londonParts().minutes + lead : -1
  const make = ([open, close]: readonly [number, number]) => {
    const out: Slot[] = []
    for (let t = open; t <= close - LAST_TABLE_BEFORE_CLOSE; t += 30) if (t > now) out.push({ minutes: t, label: clock(t) })
    return out
  }
  const lunch = services.filter(([a]) => a < 17 * 60).flatMap(make)
  const dinner = services.filter(([a]) => a >= 17 * 60).flatMap(make)
  return { lunch, dinner }
}

export function isBookable(date: YMD) {
  const today = todayInLondon()
  const t = Date.UTC(date.y, date.m - 1, date.d)
  const t0 = Date.UTC(today.y, today.m - 1, today.d)
  if (t < t0 || t > t0 + BOOKING_HORIZON_DAYS * 864e5) return false
  if (weekday(date) === 0) return false
  const s = slotsFor(date)
  return s.lunch.length + s.dinner.length > 0
}

// --- the email -----------------------------------------------------------------

export type Request = {
  date: YMD
  minutes: number
  guests: number
  occasion: string
  seat: string
  name: string
  phone: string
  notes: string
}

export const subjectFor = (r: Pick<Request, 'guests' | 'date' | 'minutes'>) =>
  `Table for ${r.guests} · ${shortDate(r.date)}, ${clock(r.minutes)}`

export function bodyFor(r: Request) {
  const rows = [
    'Hi Hive & Honey,',
    '',
    "I'd like to book a table, please.",
    '',
    `Date: ${longDate(r.date)}`,
    `Time: ${clock(r.minutes)}`,
    `Guests: ${r.guests}`,
  ]
  if (r.occasion) rows.push(`Occasion: ${r.occasion}`)
  if (r.seat) rows.push(`Seating: ${r.seat}, if possible`)
  rows.push(`Name: ${r.name}`, `Phone: ${r.phone}`)
  if (r.notes.trim()) rows.push(`Notes: ${r.notes.trim()}`)

  rows.push('', 'Thanks!', r.name)
  return rows.join('\r\n')
}

export const mailtoFor = (r: Request) =>
  `mailto:${venue.email}?subject=${encodeURIComponent(subjectFor(r))}&body=${encodeURIComponent(bodyFor(r))}`
