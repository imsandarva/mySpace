export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Runs a state update inside a native View Transition when the browser and the visitor allow it; otherwise applies it instantly.
   An async update holds the old page until it finishes, so the new snapshot can include work done in that update. */
export function transition(update) {
  if (!document.startViewTransition || reducedMotion()) return Promise.resolve(update())
  /* `update` may be async: the old page stays up until it finishes, then the new snapshot is taken. */
  const t = document.startViewTransition(() => Promise.resolve().then(update))
  /* A newer navigation skips an older transition; that abort is expected, not an error. */
  for (const p of [t.ready, t.finished, t.updateCallbackDone]) p.catch(() => {})
}
