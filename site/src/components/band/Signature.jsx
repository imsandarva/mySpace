import { contact } from '../../data/identity'
import SocialIcon from './SocialIcon'

function linkProps(link) {
  return link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

export default function Signature() {
  const { email, primary, secondary } = contact

  return (
    <div className="sign">
      <div className="sign-primary">
        <a className="sign-email" href={`mailto:${email}`}>{email}</a>
        <span className="sign-sep" aria-hidden>·</span>
        <a className="sign-link-primary" href={primary.href} {...linkProps(primary)}>{primary.label}</a>
      </div>
      <nav className="sign-secondary" aria-label="Elsewhere">
        {secondary.map((link) => (
          <a key={link.id} className={`sign-icon-link is-${link.id}`} href={link.href} aria-label={link.label} {...linkProps(link)}>
            <SocialIcon id={link.id} />
          </a>
        ))}
      </nav>
    </div>
  )
}
