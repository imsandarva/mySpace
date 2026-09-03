import { writings } from '../../data/writings'
import Panel from './Panel'
import WritingEntry from './WritingEntry'

export default function Writings() {
  return (
    <Panel id="writings" label="Writings">
      <ul className="writing-list">
        {writings.map((w) => (
          <li key={w.slug}>
            <WritingEntry {...w} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}
