import Arrow from '../ui/Arrow'
import { contact } from '../data/identity'
import { elsewhere, mailto, outbound } from '../lib/links'
import { reducedMotion } from '../lib/viewTransition'

const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })

/* Break after @ so a narrow footer wraps the domain, never the local part mid-word. */
const addressText = (email) => {
  const at = email.indexOf('@')
  if (at < 0) return email
  return <>{email.slice(0, at + 1)}<wbr />{email.slice(at + 1)}</>
}

/* The last composed moment of every page: contact set as type, everywhere else listed plainly. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-mail">
          <p className="t-meta">Contact</p>
          <a className="t-address footer-address" href={mailto}>{addressText(contact.email)}</a>
        </div>
        <nav className="footer-links" aria-label="Elsewhere">
          <p className="t-meta">Elsewhere</p>
          <ul>
            {elsewhere.map((l) => (
              <li key={l.id}><a href={l.href} {...outbound}>{l.label}<Arrow kind="out" /></a></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap footer-base t-meta">
        <button type="button" className="footer-top" onClick={toTop}>Back to top<Arrow kind="up" /></button>
      </div>
    </footer>
  )
}
