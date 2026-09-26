import type { Transition } from 'motion/react';
// One motion language for the whole explorer: the building's turn, the plan's swap and the
// numbers rolling all share these curves, so a selection reads as a single gesture.
export const EASE = [0.22, 1, 0.36, 1] as const; // settle — UI entering and leaving
export const EASE_TURN = [0.65, 0, 0.35, 1] as const; // the building turning between views
export const DUR = { quick: 0.22, base: 0.42, slow: 0.6 } as const;
export const SPRING: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 };
export const SOFT_SPRING: Transition = { type: 'spring', stiffness: 220, damping: 30 };
export const swap: Transition = { duration: DUR.base, ease: EASE };

// Same curve as EASE_TURN, for the canvas loop that animates outside React.
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
