import { identity } from '../data/identity'
import { books } from '../lib/books'
import { writings } from '../lib/writings'

const NAV = [
  { name: 'writings', href: '#/writings', label: 'Writings', count: writings.length },
  { name: 'readings', href: '#/readings', label: 'Readings', count: books.length },
]

/* Wordmark home, two sections. Static on the front page; pinned inside the archives, where the pages are long. */
export default function SiteHeader({ route }) {
  const pinned = route.name !== 'home'

  return (
    <header className={`site-header${pinned ? ' is-pinned' : ''}`}>
      <div className="wrap site-header-row">
        <a className="wordmark" href="#/" aria-label={`${identity.line.join(' ')}, home`}>{identity.line.join(' ')}</a>
        <nav className="site-nav" aria-label="Sections">
          {NAV.map((item) => (
            <a key={item.name} href={item.href} aria-current={route.name === item.name ? 'page' : undefined}>
              {item.label}<sup>{item.count}</sup>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
