import { useShelfHoverTone } from '../../hooks/useShelfHoverTone'
import Reading from './Reading'
import Writings from './Writings'

export default function DualShelf() {
  useShelfHoverTone()

  return (
    <div className="shelf">
      <Writings />
      <Reading />
    </div>
  )
}
