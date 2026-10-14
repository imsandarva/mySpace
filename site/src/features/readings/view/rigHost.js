/* One 3D book on the canvas. Opening it does not build a second copy — the shelf rig is aimed at the focus stage, then put back. */

const hosts = new Map()

export function parkRig(slug, rig, el) {
  if (!slug || !rig || !el) return
  hosts.set(slug, { rig, el, mode: rig.mode, rest: rig.rest })
}

export function claimRig(slug, el, pose = {}) {
  const host = hosts.get(slug)
  if (!host || !el) return null
  const { rig } = host
  rig.el = el
  rig.hidden = false
  if (pose.mode) { rig.mode = pose.mode; rig.front = pose.mode === 'focus' }
  if (pose.rest) rig.setRest(pose.rest)
  rig.setFade(1, true)
  rig.refresh()
  rig.wake()
  return rig
}

export function restoreRig(slug) {
  const host = hosts.get(slug)
  if (!host) return
  const { rig } = host
  rig.el = host.el
  rig.mode = host.mode; rig.front = host.mode === 'focus'
  rig.hidden = false
  rig.setRest(host.rest)
  rig.setFade(1, true)
  rig.refresh()
  rig.wake()
}
