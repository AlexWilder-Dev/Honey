import { AnimatePresence, m } from 'framer-motion'
import { snap } from '../lib/motion'

/**
 * Easter egg: a small pomsky hides just below the edge of the courtyard photo,
 * until somebody taps the photo five times in a second.
 */
export function Pomsky({ up }: { up: boolean }) {
  return (
    <span className="pomsky" aria-hidden="true">
      <m.span className="pomsky__dog" initial={false} animate={{ y: up ? '0%' : '105%' }} transition={snap}>
        <svg viewBox="0 0 160 150" className={up ? 'is-up' : ''}>
          <path d="M30 150 Q26 118 44 104 L116 104 Q134 118 130 150 Z" fill="#eceae6" />
          <g className="pomsky__ear pomsky__ear--l">
            <path d="M38 70 Q34 34 48 14 Q62 26 72 50 Z" fill="#596070" />
            <path d="M45 60 Q44 38 50 26 Q58 36 64 52 Z" fill="#f2c9c0" />
          </g>
          <g className="pomsky__ear pomsky__ear--r">
            <path d="M122 70 Q126 34 112 14 Q98 26 88 50 Z" fill="#596070" />
            <path d="M115 60 Q116 38 110 26 Q102 36 96 52 Z" fill="#f2c9c0" />
          </g>
          <path d="M80 36 C 112 36 130 56 132 82 C 134 104 120 122 80 124 C 40 122 26 104 28 82 C 30 56 48 36 80 36 Z" fill="#5f6675" />
          <path
            d="M30 86 C 32 70 44 64 58 68 C 68 71 74 76 80 84 C 86 76 92 71 102 68 C 116 64 128 70 130 86 C 132 108 116 124 80 125 C 44 124 28 108 30 86 Z"
            fill="#f7f6f3"
          />
          <ellipse cx="60" cy="62" rx="6" ry="4" fill="#f7f6f3" />
          <ellipse cx="100" cy="62" rx="6" ry="4" fill="#f7f6f3" />
          <path d="M30 92 l-6 4 l6 3 l-5 5 l7 1 l-3 6 l8 -2" fill="#f7f6f3" />
          <path d="M130 92 l6 4 l-6 3 l5 5 l-7 1 l3 6 l-8 -2" fill="#f7f6f3" />
          {/* one blue eye, one brown */}
          <g className="pomsky__eye">
            <ellipse cx="62" cy="82" rx="7.5" ry="8" fill="#1d2433" />
            <circle cx="62" cy="82" r="5.6" fill="#5aaee8" />
            <circle cx="62" cy="82.5" r="3" fill="#141a26" />
            <circle cx="64.2" cy="79.6" r="1.7" fill="#fff" />
          </g>
          <g className="pomsky__eye">
            <ellipse cx="98" cy="82" rx="7.5" ry="8" fill="#1d2433" />
            <circle cx="98" cy="82" r="5.6" fill="#8a5a2b" />
            <circle cx="98" cy="82.5" r="3" fill="#141a26" />
            <circle cx="100.2" cy="79.6" r="1.7" fill="#fff" />
          </g>
          <path d="M71 98 Q80 93 89 98 Q87 105 80 106 Q73 105 71 98 Z" fill="#1b1b1d" />
          <ellipse cx="77" cy="97.6" rx="2.6" ry="1.3" fill="#fff" opacity=".5" />
          <path d="M80 106 V110 M80 110 Q75 115 69 111 M80 110 Q85 115 91 111" stroke="#1b1b1d" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M76 112.5 Q80 121 84 112.5 Z" fill="#f08aa0" />
          <g fill="#f7f6f3" stroke="#d8d5ce" strokeWidth="1">
            <ellipse cx="46" cy="140" rx="16" ry="10" />
            <ellipse cx="114" cy="140" rx="16" ry="10" />
          </g>
          <path d="M40 136 v6 M46 135 v7 M52 136 v6 M108 136 v6 M114 135 v7 M120 136 v6" stroke="#cfcac0" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </m.span>
    </span>
  )
}

/** Its "woof!" */
export function PomskyWoof({ up }: { up: boolean }) {
  return (
    <AnimatePresence>
      {up && (
        <m.span
          className="pomsky__woof"
          initial={{ opacity: 0, scale: 0.6, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { ...snap, delay: 0.35 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          woof!
        </m.span>
      )}
    </AnimatePresence>
  )
}
