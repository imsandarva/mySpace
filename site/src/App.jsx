import Page from './components/Page'
import PinPreview from './components/pin/PinPreview'
import { useHashRoute } from './hooks/useHashRoute'

/* App is a pure composition layer. */
export default function App() {
  const route = useHashRoute()
  if (route.startsWith('pin')) return <PinPreview route={route} />
  return <Page />
}
