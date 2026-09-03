/* Deterministic spine color + ex-libris mark per book title. */

export const SPINE_COLORS = ['#B97455', '#8A9A7E', '#C9A24B', '#5B6B7A', '#8C6B87']

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function spineColorForTitle(title) {
  return SPINE_COLORS[hashString(title) % SPINE_COLORS.length]
}

export function bookMarkStrokes(title) {
  const base = hashString(title)
  const count = 2 + (base % 3)
  return Array.from({ length: count }, (_, i) => {
    const seed = hashString(`${title}:${i}`)
    const x1 = 1 + (seed % 11)
    const y1 = 2 + ((seed >> 3) % 6)
    const x2 = 4 + ((seed >> 6) % 11)
    const y2 = 2 + ((seed >> 10) % 6)
    return { x1, y1, x2, y2 }
  })
}
