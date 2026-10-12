/* Opening dance: a short choreographed turn that settles on a new pose (never snaps back). */

export const ROTATE_HINT_DELAY_MS = 500
export const INTRO_DANCE_MS = 2400

/* Offsets from the pose at open — sway through a few beats, then rest slightly turned. */
export const INTRO_DANCE_PATH = [
  { t: 0, dy: 0, dp: 0 },
  { t: 0.2, dy: 0.72, dp: 0.12 },
  { t: 0.45, dy: -0.28, dp: 0.26 },
  { t: 0.68, dy: 0.58, dp: 0.1 },
  { t: 1, dy: 0.48, dp: 0.16 },
]

export const prefersReducedRotateHint = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function playRotateHint(rig, invalidateFor) {
  if (!rig || prefersReducedRotateHint()) return undefined
  invalidateFor?.(INTRO_DANCE_MS + 400)
  rig.beginPoseScript(INTRO_DANCE_PATH, INTRO_DANCE_MS)
  return () => rig.cancelPoseScript()
}
