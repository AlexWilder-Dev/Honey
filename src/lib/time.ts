import { barHours, dayNames, dayShort, kitchenHours } from '../data/venue'

/** A moment on the venue's clock: weekday (0 = Sun) and minutes after midnight, London time. */
export type Moment = { day: number; minutes: number }

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function londonParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    date: Number(get('day')),
    day: DAYS.indexOf(get('weekday').slice(0, 3).toLowerCase()),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/**
 * Demo override, so any day and time can be shown on a call:
 * ?at=fri-23:30, ?at=mon-14:00, ?at=sun. Read from the query string either
 * side of the hash (…/?at=fri-23:30#/menu or …/#/menu?at=fri-23:30).
 */
export function parseAt(raw: string | null): Moment | null {
  if (!raw) return null
  const m = raw.trim().toLowerCase().match(/^([a-z]{3})[a-z]*(?:[-_ ]?(\d{1,2})(?::?(\d{2}))?)?$/)
  if (!m) return null
  const day = DAYS.indexOf(m[1])
  if (day < 0) return null
  const hours = m[2] === undefined ? 12 : Number(m[2])
  const mins = m[3] === undefined ? 0 : Number(m[3])
  if (hours > 23 || mins > 59) return null
  return { day, minutes: hours * 60 + mins }
}

export function overrideFromLocation(loc: Location = window.location): Moment | null {
  const fromSearch = new URLSearchParams(loc.search).get('at')
  const hashQuery = loc.hash.includes('?') ? loc.hash.slice(loc.hash.indexOf('?')) : ''
  const fromHash = new URLSearchParams(hashQuery).get('at')
  return parseAt(fromSearch ?? fromHash)
}

/** After midnight counts as the night before, until 5am. */
export function serviceMoment({ day, minutes }: Moment): Moment {
  return minutes < 5 * 60 ? { day: (day + 6) % 7, minutes: minutes + 24 * 60 } : { day, minutes }
}

// --- wording ----------------------------------------------------------------

/** "11", "3", "10:30", "midnight", "1:30" — for "till …" and "back at …". */
export function clockShort(mins: number) {
  const m = mins % (24 * 60)
  if (m === 0) return 'midnight'
  if (m === 12 * 60) return 'noon'
  const h = Math.floor(m / 60) % 12 || 12
  const mm = m % 60
  return mm ? `${h}:${String(mm).padStart(2, '0')}` : `${h}`
}

/** "5pm", "noon", "1:30am", "7:30pm". */
export function clock(mins: number) {
  const m = mins % (24 * 60)
  if (m === 0) return 'midnight'
  if (m === 12 * 60) return 'noon'
  return `${clockShort(m)}${m < 12 * 60 ? 'am' : 'pm'}`
}

export type Status = {
  tone: 'open' | 'between' | 'late' | 'closed'
  line: string
  barOpen: boolean
  kitchenOpen: boolean
}

export function statusAt(now: Moment): Status {
  const { day, minutes } = serviceMoment(now)
  const bar = barHours[day]
  const kitchen = kitchenHours[day]
  const barOpen = !!bar && minutes >= bar[0] && minutes < bar[1]
  const service = kitchen.find(([a, b]) => minutes >= a && minutes < b)

  if (bar && barOpen && service)
    return {
      tone: 'open',
      line: `Kitchen on till ${clockShort(service[1])} · bar till ${clockShort(bar[1])}`,
      barOpen,
      kitchenOpen: true,
    }

  if (bar && barOpen) {
    const next = kitchen.find(([a]) => a > minutes)
    return next
      ? { tone: 'between', line: `Kitchen back at ${clockShort(next[0])}, bar and courtyard open`, barOpen, kitchenOpen: false }
      : { tone: 'late', line: `Bar on till ${clockShort(bar[1])} · kitchen closed for the night`, barOpen, kitchenOpen: false }
  }

  if (bar && minutes < bar[0])
    return { tone: 'closed', line: `Opens ${clock(bar[0])}`, barOpen: false, kitchenOpen: false }

  // Closed for the rest of this service day: Sunday, or after last orders.
  const closed = (line: string): Status => ({ tone: 'closed', line, barOpen: false, kitchenOpen: false })
  const next = (day + 1) % 7
  if (!bar || !barHours[next]) return closed(`Closed Sundays, back Monday ${clock(barHours[1]![0])}`)
  return closed(`Closed now · opens ${clock(barHours[next]![0])}`)
}

/** Is the kitchen on, and if not, when is it next? */
export function kitchenAnswer(now: Moment): { open: boolean; text: string } {
  const { day, minutes } = serviceMoment(now)
  const on = kitchenHours[day].find(([a, b]) => minutes >= a && minutes < b)
  if (on) return { open: true, text: `Yes, till ${clock(on[1])}.` }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7
    const next = kitchenHours[d].find(([a]) => i > 0 || a > minutes)
    if (!next) continue
    if (i === 0) {
      const hadLunch = kitchenHours[day].some(([, b]) => b <= minutes)
      return { open: false, text: hadLunch ? `Back at ${clock(next[0])}.` : `From ${clock(next[0])} today.` }
    }
    const when = now.day === d ? 'today' : i === 1 ? 'tomorrow' : dayNames[d]
    return { open: false, text: `Not now. From ${clock(next[0])} ${when}.` }
  }
  return { open: false, text: 'Not now.' }
}

/** "5–11pm", "noon–3pm", "5pm–midnight", "noon–1:30am" */
export function range(a: number, b: number) {
  const pm = (x: number) => x % 1440 > 12 * 60
  const plain = (x: number) => x % 720 !== 0
  return pm(a) && pm(b) && plain(a) && plain(b) ? `${clockShort(a)}–${clock(b)}` : `${clock(a)}–${clock(b)}`
}

/** Bar and kitchen hours for one weekday, in words. */
export function hoursSummary(day: number) {
  const bar = barHours[day]
  if (!bar) return { bar: 'Closed', kitchen: 'Closed', services: ['Closed'] }
  const services = kitchenHours[day].map(([a, b]) => range(a, b))
  return { bar: range(bar[0], bar[1]), kitchen: services.join(', '), services }
}

/** The week as rows of matching days: Monday / Tuesday–Thursday / Friday–Saturday / Sunday. */
export function weekRows() {
  const order = [1, 2, 3, 4, 5, 6, 0]
  const rows: { days: number[]; bar: string; kitchen: string; services: string[] }[] = []
  for (const d of order) {
    const h = hoursSummary(d)
    const last = rows[rows.length - 1]
    if (last && last.bar === h.bar && last.kitchen === h.kitchen) last.days.push(d)
    else rows.push({ days: [d], ...h })
  }
  const name = (names: string[], r: { days: number[] }) =>
    r.days.length > 1 ? `${names[r.days[0]]}–${names[r.days[r.days.length - 1]]}` : names[r.days[0]]
  return rows.map((r) => ({ ...r, label: name(dayNames, r), short: name(dayShort, r) }))
}

export function momentLabel({ day, minutes }: Moment) {
  return `${dayShort[day]} ${clock(minutes)}`
}
