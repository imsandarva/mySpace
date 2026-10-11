import Arrow from '../../ui/Arrow'
import { about, contact, identity } from '../../data/identity'
import { mailto, outbound } from '../../lib/links'
import { curly } from '../../lib/text'
import { useIntro } from './useIntro'

const PORTRAIT = `${import.meta.env.BASE_URL}assets/my_painting.webp`

/* Name first, set as a masthead; a single line of voice; three ways to reach me; the portrait as a printed plate.
   On a phone the plate sits beside the text, on desktop it hangs from the right margin. */
export default function Hero() {
  const intro = useIntro()

  return (
    <section className={`hero wrap${intro ? ' is-intro' : ''}`} aria-labelledby="name">
      <h1 id="name" className="t-name hero-name">{identity.line.join(' ')}</h1>

      <div className="hero-copy">
        <p className="t-lede">{curly(about)}</p>
        <ul className="hero-links" role="list">
          <li><a className="link" href={contact.primary.href} {...outbound}>{contact.primary.label}<Arrow kind="out" /></a></li>
          <li><a className="link" href={mailto}>Email</a></li>
          <li><a className="link" href={contact.pinterest.href} {...outbound}>{contact.pinterest.label}<Arrow kind="out" /></a></li>
        </ul>
      </div>

      <figure className="plate">
        <img src={PORTRAIT} alt="Painted portrait of Sandarva" width="800" height="1200" fetchPriority="high" decoding="async" />
        <figcaption className="t-meta">Sandarva Paudel</figcaption>
      </figure>
    </section>
  )
}
