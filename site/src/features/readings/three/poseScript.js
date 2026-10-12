/* Smooth pose paths for the rig: keyframes are `{ t: 0–1, dy, dp }` offsets from the pose when the script starts. */

const smooth = (t) => t * t * (3 - 2 * t)

export function samplePosePath(keyframes, u) {
  const last = keyframes[keyframes.length - 1]
  if (u <= keyframes[0].t) return keyframes[0]
  if (u >= last.t) return last
  let i = 0
  while (i < keyframes.length - 2 && keyframes[i + 1].t < u) i++
  const a = keyframes[i], b = keyframes[i + 1]
  const w = smooth((u - a.t) / (b.t - a.t))
  return { dy: a.dy + (b.dy - a.dy) * w, dp: a.dp + (b.dp - a.dp) * w }
}
