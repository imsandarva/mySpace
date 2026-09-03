/* Deterministic scatter so each word starts as a loose thought, then settles. Intimate, not theatrical. */

export function splitRows(lines) {
  return lines.map((line) => line.split(/\s+/).filter(Boolean))
}

export function wordCount(lines) {
  return splitRows(lines).reduce((n, row) => n + row.length, 0)
}

export function wordScatter(index, total, compact = false) {
  const k = compact ? 0.34 : 0.58
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - 0.9
  const dist = (18 + (index % 4) * 11) * k
  return {
    x: Math.round(Math.cos(angle) * dist * 1.15),
    y: Math.round(Math.sin(angle) * dist * 0.7),
    rot: ((index % 5) - 2) * (compact ? 1.1 : 1.85),
    scale: 0.94 + (index % 3) * 0.03,
  }
}
