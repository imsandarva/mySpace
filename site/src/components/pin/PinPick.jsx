const CARDS = [
  { href: '#/pin/profile', kicker: 'Profile', title: 'The latest pins from the account.', hint: 'embedUser' },
  { href: '#/pin/board', kicker: 'Board', title: 'A single board, up to fifty pins.', hint: 'embedBoard' },
]

export default function PinPick() {
  return (
    <section className="pin-pick" aria-labelledby="pin-pick-title">
      <p className="pin-kicker">Compare</p>
      <h1 id="pin-pick-title" className="pin-title">Two official Pinterest widgets.</h1>
      <div className="pin-cards">
        {CARDS.map((card) => (
          <a key={card.href} className="pin-card" href={card.href}>
            <span className="pin-card-kicker">{card.kicker}</span>
            <span className="pin-card-title">{card.title}</span>
            <span className="pin-card-hint">{card.hint}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
