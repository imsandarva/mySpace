import Arrow from '../ui/Arrow'
import { contact } from '../data/identity'
import { elsewhere, mailto, outbound } from '../lib/links'
import { reducedMotion } from '../lib/viewTransition'

const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })

/* The last composed moment of every page: the address set large, everywhere else listed plainly. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-mail">
          <p className="t-meta">Email</p>
          <a className="footer-address" href={mailto}>{contact.email}</a>
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
        <span>© {new Date().getFullYear()} Sandarva Paudel</span>
        <button type="button" className="footer-top" onClick={toTop}>Back to top<Arrow kind="up" /></button>
      </div>
    </footer>
  )
}
