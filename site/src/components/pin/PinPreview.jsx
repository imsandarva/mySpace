import PinNav from './PinNav'
import PinPick from './PinPick'
import PinStage from './PinStage'

function viewFrom(route) {
  if (route === 'pin/board') return 'board'
  if (route === 'pin/profile') return 'profile'
  return 'pick'
}

export default function PinPreview({ route }) {
  const view = viewFrom(route)

  return (
    <main className="page pin-page">
      <PinNav view={view} />
      {view === 'pick' ? <PinPick /> : <PinStage kind={view} />}
    </main>
  )
}
