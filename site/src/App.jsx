import { bare, views } from './app/views'
import Shell from './app/Shell'
import { useRoute } from './app/useRoute'

/* Composition only: pick the page for the route and, unless it brings its own chrome, wrap it in the shell. */
export default function App() {
  const route = useRoute()
  const View = views[route.name]
  const page = <View route={route} />
  return bare.has(route.name) ? page : <Shell route={route}>{page}</Shell>
}
