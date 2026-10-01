import SocialIcon from '../../components/band/SocialIcon'

function outside(href) {
  return /^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

/* 44px hit target; the glyph itself stays 18px and optically flush to the text edge. */
export default function IconLink({ id, label, href }) {
  return (
    <a className="m-icon" href={href} aria-label={label} {...outside(href)}>
      <SocialIcon id={id} className={`m-glyph is-${id}`} />
    </a>
  )
}
