const LINKS = [
  { href: '#/pin/profile', id: 'profile', label: 'Profile' },
  { href: '#/pin/board', id: 'board', label: 'Board' },
]

export default function PinNav({ view }) {
  return (
    <header className="pin-nav">
      <a className="pin-nav-back" href="#/">← Site</a>
      <nav className="pin-nav-tabs" aria-label="Pinterest widgets">
        {LINKS.map((link) => (
          <a key={link.id} href={link.href} className={view === link.id ? 'is-on' : ''} aria-current={view === link.id ? 'page' : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
