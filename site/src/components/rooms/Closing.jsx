import Room from '../ui/Room'
import { contact } from '../../data/identity'

export default function Closing() {
  return (
    <Room id="closing" className="room-closing">
      <a className="closing-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
      <p className="closing-sign">{contact.sign}</p>
    </Room>
  )
}
