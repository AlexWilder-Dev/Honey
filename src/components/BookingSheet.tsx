import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { upcoming } from '../data/events'
import { venue } from '../data/venue'
import { bodyFor, longDate, mailtoFor, slotsFor, subjectFor, weekday, type Request, type YMD } from '../lib/booking'
import { money, plural } from '../lib/format'
import { pour } from '../lib/motion'
import { useTable } from '../state/table'
import { useUi, type BookingPreset, type Seat } from '../state/ui'
import { Calendar } from './Calendar'
import { Sheet, SheetClose } from './Sheet'

const OCCASIONS = ['Birthday', 'Anniversary', 'Date night', 'Work do', 'Just because']
/** Seasonal reasons to book, while they're on. */
const occasions = () => [...upcoming().flatMap((e) => (e.occasion ? [e.occasion] : [])), ...OCCASIONS]
const SEATS: { value: Seat; label: string }[] = [
  { value: '', label: 'Anywhere' },
  { value: 'The courtyard', label: 'The courtyard' },
  { value: 'Upstairs', label: 'Upstairs' },
]

type Errors = Partial<Record<'date' | 'time' | 'name' | 'phone', string>>

export function BookingSheet() {
  const { panel, close, preset } = useUi()
  const open = panel === 'booking'
  return (
    <Sheet open={open} onClose={close} label="Book a table" className="sheet--booking" tone="light">
      <SheetClose onClose={close} />
      <BookingForm preset={preset} onDone={close} />
    </Sheet>
  )
}

function BookingForm({ preset, onDone }: { preset: BookingPreset; onDone: () => void }) {
  const table = useTable()
  const ids = { date: useId(), time: useId(), name: useId(), phone: useId(), notes: useId(), guests: useId() }

  const [date, setDate] = useState<YMD | null>(null)
  const [minutes, setMinutes] = useState<number | null>(null)
  const [guests, setGuests] = useState(2)
  const [occasion, setOccasion] = useState(preset.occasion ?? '')
  const [seat, setSeat] = useState<Seat>(preset.seat ?? '')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [sendTable, setSendTable] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<Request | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setSeat(preset.seat ?? '')
    setOccasion(preset.occasion ?? '')
  }, [preset])

  const slots = date ? slotsFor(date) : null
  const pickDate = (d: YMD) => {
    const next = slotsFor(d)
    if (![...next.lunch, ...next.dinner].some((s) => s.minutes === minutes)) setMinutes(null)
    setDate(d)
    setErrors((e) => ({ ...e, date: undefined }))
  }

  const request = (): Request | null => {
    const e: Errors = {}
    if (!date) e.date = 'Pick a day.'
    if (minutes === null) e.time = 'Pick a time.'
    if (!name.trim()) e.name = 'Who is the table for?'
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'A phone number, in case we need to reach you.'
    setErrors(e)
    if (Object.keys(e).length || !date || minutes === null) return null
    return {
      date,
      minutes,
      guests,
      occasion,
      seat,
      name: name.trim(),
      phone: phone.trim(),
      notes,
      table: sendTable ? table.lines.map((l) => ({ name: l.name, qty: l.qty, amount: l.amount, label: l.label, kind: l.kind })) : [],
    }
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const r = request()
    if (!r) {
      const firstError = document.querySelector<HTMLElement>('.book [aria-invalid="true"], .book .field--error button, .book .field--error input')
      firstError?.focus()
      return
    }
    window.location.href = mailtoFor(r)
    setSent(r)
  }

  const copy = async () => {
    if (!sent) return
    try {
      await navigator.clipboard.writeText(`${subjectFor(sent)}\n\n${bodyFor(sent)}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (sent) {
    return (
      <m.div className="book book--sent" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={pour}>
        <h2 className="h-caps sheet__title" tabIndex={-1} data-autofocus>
          Your email’s ready
        </h2>
        <p className="book__lede">
          It’s written and addressed to {venue.email}. Press send, and the team will reply to confirm your table.
        </p>
        <p className="book__ticket">
          <span className="book__ticket-label">Subject</span>
          {subjectFor(sent)}
        </p>
        <div className="book__fallback">
          <p>Didn't open?</p>
          <a className="btn btn--black" href={mailtoFor(sent)}>
            Open the email again
          </a>
          <button type="button" className="btn btn--line" onClick={copy}>
            {copied ? 'Copied' : 'Copy the details'}
          </button>
          <p>
            Or{' '}
            <a href={venue.instagram} target="_blank" rel="noreferrer" className="link">
              message us on Instagram
            </a>{' '}
            or call <a href={venue.phoneHref}>{venue.phone}</a>.
          </p>
        </div>
        <p className="book__small">Live version can plug into a booking system.</p>
        <button type="button" className="btn btn--yellow" onClick={onDone}>
          Done
        </button>
      </m.div>
    )
  }

  const timeGroups = slots ? ([['Lunch', slots.lunch], ['Dinner', slots.dinner]] as const) : []

  return (
    <form className="book" onSubmit={submit} noValidate>
      <header className="sheet__top">
        <h2 className="h-caps sheet__title">Book a table</h2>
        <p className="sheet__sub">Pick a day and a time and say who’s coming. We’ll write the email for you, so there’s no back and forth.</p>
      </header>

      <fieldset className={`field ${errors.date ? 'field--error' : ''}`}>
        <legend id={ids.date} className="field__label">
          Day
        </legend>
        <Calendar value={date} onChange={pickDate} labelledBy={ids.date} />
        {errors.date && <p className="field__error">{errors.date}</p>}
      </fieldset>

      <fieldset className={`field ${errors.time ? 'field--error' : ''}`}>
        <legend id={ids.time} className="field__label">
          Time {date && <span className="field__hint">{longDate(date)}</span>}
        </legend>
        {!date && <p className="field__hint">Pick a day first. Tables run while the kitchen's on.</p>}
        <AnimatePresence mode="wait">
          {date && (
            <m.div
              key={`${date.y}-${date.m}-${date.d}`}
              className="times"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={pour}
            >
              {timeGroups.map(([label, list]) => (
                <div className="times__group" key={label} role="radiogroup" aria-label={label}>
                  <p className="times__label">{label}</p>
                  {list.length ? (
                    <div className="chips">
                      {list.map((s) => (
                        <button
                          key={s.minutes}
                          type="button"
                          role="radio"
                          aria-checked={minutes === s.minutes}
                          className={`chip ${minutes === s.minutes ? 'is-on' : ''}`}
                          onClick={() => { setMinutes(s.minutes); setErrors((e) => ({ ...e, time: undefined })) }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="field__hint">{weekday(date) === 1 && label === 'Lunch' ? 'Mondays are evenings only.' : 'None left today.'}</p>
                  )}
                </div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
        {errors.time && <p className="field__error">{errors.time}</p>}
      </fieldset>

      <div className="field field--row">
        <p id={ids.guests} className="field__label">
          Guests
        </p>
        <div className="stepper" role="group" aria-labelledby={ids.guests}>
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="One fewer guest" disabled={guests <= 1}>
            −
          </button>
          <output aria-live="polite">{plural(guests, 'guest')}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="One more guest" disabled={guests >= 20}>
            +
          </button>
        </div>
        {guests >= 10 && (
          <p className="field__hint field__hint--wide">
            Bigger group? A quick call helps: <a href={venue.phoneHref}>{venue.phone}</a>
          </p>
        )}
      </div>

      <fieldset className="field">
        <legend className="field__label">
          Occasion <span className="field__hint">optional</span>
        </legend>
        <div className="chips">
          {occasions().map((o) => (
            <button key={o} type="button" aria-pressed={occasion === o} className={`chip ${occasion === o ? 'is-on' : ''}`} onClick={() => setOccasion((c) => (c === o ? '' : o))}>
              {o}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Where would you like to sit?</legend>
        <div className="chips" role="radiogroup" aria-label="Seating">
          {SEATS.map((s) => (
            <button key={s.label} type="button" role="radio" aria-checked={seat === s.value} className={`chip ${seat === s.value ? 'is-on' : ''}`} onClick={() => setSeat(s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field-pair">
        <div className={`field ${errors.name ? 'field--error' : ''}`}>
          <label htmlFor={ids.name} className="field__label">
            Name
          </label>
          <input id={ids.name} className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${ids.name}-e` : undefined} />
          {errors.name && <p className="field__error" id={`${ids.name}-e`}>{errors.name}</p>}
        </div>
        <div className={`field ${errors.phone ? 'field--error' : ''}`}>
          <label htmlFor={ids.phone} className="field__label">
            Phone
          </label>
          <input id={ids.phone} className="input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${ids.phone}-e` : undefined} />
          {errors.phone && <p className="field__error" id={`${ids.phone}-e`}>{errors.phone}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor={ids.notes} className="field__label">
          Notes <span className="field__hint">optional</span>
        </label>
        <textarea id={ids.notes} className="input input--area" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dietary needs, a pram, bringing the dog…" />
      </div>

      {table.count.all > 0 && (
        <div className="field attached">
          <div className="attached__head">
            <p className="field__label">Your table</p>
            <label className="toggle">
              <input type="checkbox" checked={sendTable} onChange={(e) => setSendTable(e.target.checked)} />
              <span>Send it with the booking</span>
            </label>
          </div>
          <div className={`attached__body ${sendTable ? '' : 'is-off'}`}>
            <ul>
              <li className="attached__kind">{plural(table.count.plates, 'plate')}</li>
              {table.plates.map((l) => (
                <li key={l.key}>
                  {l.qty} × {l.name}
                </li>
              ))}
            </ul>
            <ul>
              <li className="attached__kind">{plural(table.count.glasses, 'glass', 'glasses')}</li>
              {table.glasses.map((l) => (
                <li key={l.key}>
                  {l.qty} × {l.name}
                  {l.label && <small> {l.label.toLowerCase()}</small>}
                </li>
              ))}
            </ul>
            <p className="attached__total">{money(table.total)} as listed</p>
          </div>
        </div>
      )}

      <footer className="sheet__foot book__foot">
        {date && minutes !== null && <p className="book__preview">{subjectFor({ guests, date, minutes })}</p>}
        <button type="submit" className="btn btn--yellow book__submit">
          Send booking request
        </button>
        <p className="book__small">Opens an email to {venue.email}, already filled in.</p>
      </footer>
    </form>
  )
}
