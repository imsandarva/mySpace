export default function Panel({ id, label, children }) {
  return (
    <section className="panel" id={id} aria-labelledby={`${id}-label`}>
      <h2 id={`${id}-label`} className="panel-label">{label}</h2>
      {children}
    </section>
  )
}
