import type { ImageKey } from '../components/Img'
import { londonParts } from '../lib/time'

/*
 * What's on, from the venue's own events page and Leicester Restaurant Week's
 * listing (sources in intake/research.md). Dated items disappear once they've
 * passed, so the page never advertises last week.
 */

export type VenueEvent = {
  id: string
  /** London dates, inclusive */
  from: string
  to: string
  kicker: string
  title: string
  when: string
  time: string
  blurb: string
  poster?: ImageKey
  occasion?: string
  /** a few words for the cover */
  short: string
}

export const events: VenueEvent[] = [
  {
    id: 'restaurant-week',
    from: '2026-10-19',
    to: '2026-11-01',
    kicker: 'Leicester Restaurant Week',
    title: '3 dishes for £25',
    short: 'Restaurant Week, three dishes for £25',
    when: '19 Oct – 1 Nov',
    time: 'Lunch and dinner',
    blurb: 'Three plates for £25 at lunch or dinner, plus the exclusive Leicester Restaurant Week cocktail.',
    occasion: 'Leicester Restaurant Week',
  },
  {
    id: 'halloween',
    from: '2026-10-30',
    to: '2026-10-30',
    kicker: 'The Basement presents',
    title: 'Halloween Garden Party',
    short: 'a Halloween party in the courtyard',
    when: 'Fri 30 Oct',
    time: '8pm till 1am',
    blurb: 'The last-Friday DJ set goes out to the courtyard for Halloween. Say less, dance more.',
    poster: 'poster-halloween',
  },
  {
    id: 'christmas',
    from: '2026-10-01',
    to: '2026-12-31',
    kicker: 'Christmas menu',
    title: 'Three courses, £45',
    short: 'Christmas at £45 a head',
    when: 'Booking now',
    time: 'Welcome drink included',
    blurb: 'Smoked pork belly, turkey ballotine wrapped in bacon, Christmas pudding parfait with warm Baileys custard. Vegan and dietary needs on request.',
    poster: 'poster-christmas',
    occasion: 'Christmas menu',
  },
]

/** Every last Friday of the month, from their own listing. */
export const regular = {
  title: 'The Basement presents',
  when: 'Last Friday of the month, 8pm till 1am',
  quote: 'Our little last Friday of the month Dj set, come enjoy the free grooves and beats. Say less, Dance more',
}

/** Things they've done lately: proof the place has a pulse. */
export const lately = [
  {
    when: 'Sept 2026',
    title: 'Negroni Week',
    detail: 'Black Forest, Apple Sour, and an Apricot & Thyme White Negroni, £9.50 each. Baby Negronis £6.',
  },
  { when: 'Mar 2026', title: 'Hey, Mama!', detail: "Mother's Day sharing plates. Mum's first drink on the house." },
  { when: 'Jan 2026', title: 'Burns Night whisky tasting', detail: 'Bunnahabhain 12, Tobermory 12 and Ledaig 18, and a piper on the night.' },
  { when: 'Aug 2025', title: 'The Hive Sessions', detail: 'Live music and bourbon cocktails with Yellowstone Bourbon.' },
]

const todayKey = () => {
  const p = londonParts()
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.date).padStart(2, '0')}`
}

/** Still to come, soonest first; Christmas (booking now, on through December) goes last. */
export function upcoming(): VenueEvent[] {
  const today = todayKey()
  const rank = (e: VenueEvent) => (e.id === 'christmas' ? '9' : e.from)
  return events.filter((e) => e.to >= today).sort((a, b) => rank(a).localeCompare(rank(b)))
}
