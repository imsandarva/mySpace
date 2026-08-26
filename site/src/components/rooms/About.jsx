import Room from '../ui/Room'
import { about } from '../../data/identity'

export default function About() {
  return (
    <Room id="about" className="room-about" label="About">
      <div className="about-copy">
        {about.map((p) => <p key={p}>{p}</p>)}
      </div>
    </Room>
  )
}
