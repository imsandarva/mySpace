import { contact } from '../../data/identity'

export function SocialStrip() {
  return (
    <nav className="sign-social" aria-label="Social">
      {contact.socials.map((link) => (
        <a
          key={link.id}
          className="sign-link"
          href={link.href}
          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

export default function Signature() {
  return (
    <div className="sign">
      <a className="sign-email" href={`mailto:${contact.email}`}>{contact.email}</a>
    </div>
  )
}
