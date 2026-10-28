import { lazy, Suspense } from 'react'
import { bare, views } from './app/views'
import Shell from './app/Shell'
import { useRoute } from './app/useRoute'

/* Dev-only pages stay out of `views`, so their modules — and `/api/write` — cannot enter the production bundle. */
const WriteEntry = import.meta.env.DEV ? lazy(() => import('./features/editor/WriteEntry.jsx')) : null
const DraftsPage = import.meta.env.DEV ? lazy(() => import('./features/drafts/DraftsPage.jsx')) : null

const pageFor = (route) => {
  if (route.name === 'write' && WriteEntry) return WriteEntry
  if (route.name === 'drafts' && DraftsPage) return DraftsPage
  return views[route.name]
}

/* Composition only: pick the page for the route and, unless it brings its own chrome, wrap it in the shell. */
export default function App() {
  const route = useRoute()
  const View = pageFor(route)
  if (!View) return null
  /* A new id is a new piece. Remounting is what makes `+ Write` and each draft open cleanly. */
  const page = <View key={route.name === 'write' ? route.params.id || 'new' : undefined} route={route} />
  const frame = bare.has(route.name) ? page : <Shell route={route}>{page}</Shell>
  return <Suspense fallback={null}>{frame}</Suspense>
}
