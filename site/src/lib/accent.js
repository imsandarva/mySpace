/* Named inks for the reading shelf — resolved to CSS tokens, never computed from cover art. */

const palette = {
  clay: 'var(--accent-clay)',
  terracotta: 'var(--accent-terracotta)',
  sage: 'var(--accent-sage)',
  ochre: 'var(--accent-ochre)',
  slate: 'var(--accent-slate)',
  burgundy: 'var(--accent-burgundy)',
  moss: 'var(--accent-moss)',
  plum: 'var(--accent-plum)',
  sand: 'var(--accent-sand)',
  ink: 'var(--accent-ink)',
}

export function accentVar(name) {
  return palette[name] ?? palette.sand
}
