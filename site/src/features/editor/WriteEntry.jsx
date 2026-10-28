import { useLayoutEffect, useState } from 'react'
import WriteDesk from './WriteDesk'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/* `#/write` is a dev route. A new piece gets its id in the address before the first word, so a refresh comes back here. */
export default function WriteEntry({ route }) {
  const [id] = useState(() => (UUID.test(route?.params?.id || '') ? route.params.id : crypto.randomUUID()))

  useLayoutEffect(() => {
    document.title = 'Write — Sandarva'
    if (route?.params?.id !== id) history.replaceState(null, '', `#/write/${id}`)
  }, [id, route?.params?.id])

  return <WriteDesk id={id} />
}
