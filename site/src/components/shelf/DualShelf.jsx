import Reading from './Reading'
import Writings from './Writings'

export default function DualShelf() {
  return (
    <div className="shelf">
      <Writings />
      <Reading />
    </div>
  )
}
