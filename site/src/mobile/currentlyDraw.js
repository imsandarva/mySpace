/* One draw per page load. Later views in the same visit show the mark already finished. */
let seen = false

export function currentlyShouldDraw() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !seen
}

export function markCurrentlyDrawn() {
  seen = true
}
