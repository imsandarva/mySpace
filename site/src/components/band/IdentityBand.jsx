import { identity } from '../../data/identity'
import AboutCopy from './AboutCopy'
import IdentityLine from './IdentityLine'
import Signature, { SocialStrip } from './Signature'

export default function IdentityBand({ arrival }) {
  return (
    <header className="band-wrap">
      <div className="band">
        <IdentityLine lines={identity.line} {...arrival} />
        <div className="band-rest">
          <AboutCopy />
          <Signature />
        </div>
      </div>
      <SocialStrip />
    </header>
  )
}
