/* Deterministic scatter so each word starts as a loose thought, then settles. */

export function splitRows(lines) {
  return lines.map((line) => line.split(/\s+/).filter(Boolean))
}

export function wordCount(lines) {
  return splitRows(lines).reduce((n, row) => n + row.length, 0)
}

export function wordScatter(index, total, compact = false) {
  const k = compact ? 0.52 : 1
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - 0.9
  const dist = (26 + (index % 4) * 16) * k
  return {
    x: Math.round(Math.cos(angle) * dist * 1.2),
    y: Math.round(Math.sin(angle) * dist * 0.62),
    rot: ((index % 5) - 2) * (compact ? 1.6 : 2.6),
    scale: 0.9 + (index % 3) * 0.045,
  }
}
