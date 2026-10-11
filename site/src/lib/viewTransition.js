import { flushSync } from 'react-dom'

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Runs a state update inside a native View Transition (shared-element morphs) when the browser and the visitor allow it;
   otherwise applies it instantly. flushSync makes React commit before the "after" snapshot is taken. */
export function transition(update) {
  if (!document.startViewTransition || reducedMotion()) return update()
  document.startViewTransition(() => flushSync(update))
}
