/* One pill. Primary starts something; quiet is the other action. A href is a link, otherwise a button. */
export default function Pill({ href, tone = 'quiet', children, onClick }) {
  const className = `pill is-${tone === 'primary' ? 'primary' : 'quiet'}`
  if (href) return <a className={className} href={href}>{children}</a>
  return <button type="button" className={className} onClick={onClick}>{children}</button>
}
