import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { pour } from '../lib/motion'

type Props = { children: ReactNode; className?: string; delay?: number; amount?: number; as?: 'div' | 'li' | 'figure' | 'p' }

/** Settles into place from just above when scrolled into view. */
export function Pour({ children, className, delay = 0, amount = 0.25, as = 'div' }: Props) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: -22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...pour, delay }}
    >
      {children}
    </Tag>
  )
}
