import { useEffect, useState } from 'react'

let played = false

/* True only for the first render of a page load — the hero arrives once, and never replays when you come back home. */
export function useIntro() {
  const [intro] = useState(() => !played)
  useEffect(() => { played = true }, [])
  return intro
}
