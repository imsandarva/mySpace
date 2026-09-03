import { useStatementArrival } from '../hooks/useStatementArrival'
import IdentityBand from './band/IdentityBand'
import DualShelf from './shelf/DualShelf'

/* The whole site is one composed screen. */
export default function Page() {
  const arrival = useStatementArrival()

  return (
    <main className={`page is-${arrival.mode}`}>
      <IdentityBand arrival={arrival} />
      <DualShelf />
    </main>
  )
}
