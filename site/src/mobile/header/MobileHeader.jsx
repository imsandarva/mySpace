import { about, contact, identity } from '../../data/identity'
import IconLink from './IconLink'

function headerLinks(source) {
  return [
    source.primary,
    { id: 'email', label: 'Email', href: `mailto:${source.email}` },
    source.pinterest,
    ...source.secondary,
  ]
}

/* Slim left-aligned introduction. One icon row replaces the two desktop link systems. */
export default function MobileHeader() {
  return (
    <header className="m-band m-rise">
      <h1 className="m-name">{identity.line.join(' ')}</h1>
      <p className="m-tagline">{about}</p>
      <nav className="m-links" aria-label="Elsewhere">
        {headerLinks(contact).map((link) => <IconLink key={link.id} {...link} />)}
      </nav>
    </header>
  )
}
