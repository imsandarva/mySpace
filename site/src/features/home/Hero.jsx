import { about, identity } from '../../data/identity'
import { curly } from '../../lib/text'
import { useIntro } from './useIntro'

const PORTRAIT = `${import.meta.env.BASE_URL}assets/my_painting.webp`

/* Name first, set as a masthead; one sentence of voice; the portrait as a printed plate.
   Reach-me links live in the footer, not here. On a phone the plate sits beside the text;
   on desktop it hangs from the right margin. */
export default function Hero() {
  const intro = useIntro()

  return (
    <section className={`hero wrap${intro ? ' is-intro' : ''}`} aria-labelledby="name">
      <h1 id="name" className="t-name hero-name">{identity.line.join(' ')}</h1>

      <p className="t-lede hero-copy">{curly(about)}</p>

      <figure className="plate">
        <img src={PORTRAIT} alt="Painted portrait of Sandarva" width="800" height="1200" fetchpriority="high" decoding="async" />
        <figcaption className="t-meta">Sandarva Paudel</figcaption>
      </figure>
    </section>
  )
}
