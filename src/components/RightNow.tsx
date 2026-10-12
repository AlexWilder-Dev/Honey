import { useVenueClock } from '../state/clock'
import { momentLabel } from '../lib/time'

/** The live status line, in London time (or the ?at= demo time). */
export function RightNow({ variant = 'line', className = '' }: { variant?: 'line' | 'big'; className?: string }) {
  const { status, moment, demo } = useVenueClock()
  return (
    <p className={`now now--${variant} now--${status.tone} ${className}`}>
      <span className="now__dot" aria-hidden="true" />
      <span className="sr-only">Right now: </span>
      <span className="now__line">{status.line}</span>
      {demo && (
        <span className="now__demo" title="Demo time set by ?at= in the address">
          demo · {momentLabel(moment)}
        </span>
      )}
    </p>
  )
}
