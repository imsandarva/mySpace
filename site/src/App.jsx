import Page from './components/Page'
import PinPreview from './components/pin/PinPreview'
import { useHashRoute } from './hooks/useHashRoute'
import MobileSite from './mobile/MobileSite'
import { usePhone } from './mobile/usePhone'

/* Composition only: pins, the phone front door, or the finished desktop page. */
export default function App() {
  const route = useHashRoute()
  const phone = usePhone()
  if (route.startsWith('pin')) return <PinPreview route={route} />
  return phone ? <MobileSite /> : <Page />
}
