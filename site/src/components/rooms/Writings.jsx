import Room from '../ui/Room'
import { writings } from '../../data/writings'

export default function Writings() {
  return (
    <Room id="writings" className="room-writings" label="Written">
      <ul className="writing-list">
        {writings.map((w) => (
          <li key={w.slug}>
            <a className="writing-entry" href={w.url} target="_blank" rel="noopener noreferrer">
              <span className="writing-thumb">
                <img src={w.thumb} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="writing-body">
                <span className="writing-title">{w.title}</span>
                <span className="writing-sub">{w.subtitle}</span>
                <span className="writing-exit">on Substack →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Room>
  )
}
