import MobileCurrently from './MobileCurrently'

export default function CurrentBook({ title, author, ruled = false }) {
  return (
    <article className={`m-current${ruled ? ' is-ruled' : ''}`}>
      <MobileCurrently />
      <h3 className="m-current-title">{title}</h3>
      <p className="m-current-author">{author}</p>
    </article>
  )
}
