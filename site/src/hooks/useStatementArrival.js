import { useEffect, useState } from 'react'

const FONT_WAIT = 180
const STAGGER = 48
const WORD_MS = 780

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isCompact = () => window.matchMedia('(max-width: 960px)').matches

async function fontsReadySoon() {
  if (!document.fonts?.ready) return true
  return Promise.race([
    document.fonts.ready.then(() => true),
    new Promise((res) => setTimeout(() => res(false), FONT_WAIT)),
  ])
}

/* Signature entrance: scatter if type is ready, otherwise a plain fade — never a wait. */
export function useStatementArrival() {
  const [mode, setMode] = useState('pending')
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    let alive = true
    setCompact(isCompact())
    const run = async () => {
      if (prefersReduced()) { if (alive) setMode('fade'); return }
      const ready = await fontsReadySoon()
      if (alive) setMode(ready ? 'scatter' : 'fade')
    }
    run()
    return () => { alive = false }
  }, [])

  return { mode, compact, stagger: STAGGER, wordMs: WORD_MS }
}
