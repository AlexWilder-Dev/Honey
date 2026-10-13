import type { Transition } from 'framer-motion'

/**
 * The one motion signature: a pour. Heavy and critically damped, so things
 * arrive slowly and settle without a bounce.
 */
export const pour: Transition = { type: 'spring', stiffness: 70, damping: 19, mass: 1.3 }

/** For things you open and close: the same no-bounce settle, quick enough not to keep you waiting. */
export const snap: Transition = { type: 'spring', stiffness: 520, damping: 46, mass: 1 }
