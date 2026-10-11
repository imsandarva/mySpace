import PinNav from './PinNav'
import PinPick from './PinPick'
import PinStage from './PinStage'

/* Hidden Pinterest widget comparison (#/pin, #/pin/profile, #/pin/board) — kept working, outside the site shell. */
export default function PinPreview({ route }) {
  const view = route.params.view ?? 'pick'

  return (
    <main className="wrap pin-page">
      <PinNav view={view} />
      {view === 'pick' ? <PinPick /> : <PinStage kind={view} />}
    </main>
  )
}
