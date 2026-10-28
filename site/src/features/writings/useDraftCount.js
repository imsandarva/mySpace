import { useEffect, useState } from 'react'
import { listDrafts } from '../editor/api'

/* The number beside Drafts. If the list can't be read, the number stays off — the drafts page is what explains the failure. */
export function useDraftCount() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    let cancel = false
    const load = () => listDrafts()
      .then((rows) => { if (!cancel) setCount(rows.length) })
      .catch(() => { if (!cancel) setCount(null) })
    load()
    const onVis = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { cancel = true; document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return count
}
