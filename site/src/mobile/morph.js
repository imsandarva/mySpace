import { flushSync } from 'react-dom'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DURATION = 320
let ticket = 0

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* The other shelf stays put while this one leaves the document flow. */
function hold(name) {
  if (!name) return
  const slot = document.querySelector(`[data-slot="${name}"]`)
  const shelf = slot?.querySelector('[data-shelf]')
  if (!slot || !shelf || shelf.classList.contains('is-expanded')) return
  slot.style.setProperty('--hold', `${Math.round(shelf.getBoundingClientRect().height)}px`)
}

function clear(node) {
  node.style.transition = ''
  node.style.transform = ''
  node.style.opacity = ''
  node.style.transformOrigin = ''
}

/* The shelf and the list are the same elements. Measure, retarget, then ease them into place. */
function play(first) {
  const mine = ++ticket
  const moves = []
  first.forEach((a, node) => {
    const b = node.getBoundingClientRect()
    if (!a.width || !b.width) return
    const seen = a.bottom > 0 && a.top < window.innerHeight && a.right > -8 && a.left < window.innerWidth + 8
    const index = moves.length
    node.style.transformOrigin = 'top left'
    node.style.transition = 'none'
    if (!seen) {
      node.style.opacity = '0'
      node.style.transform = 'translate3d(0, 8px, 0)'
      moves.push({ node, delay: Math.min(index, 8) * 18, fade: true })
      return
    }
    const dx = a.left - b.left
    const dy = a.top - b.top
    node.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${a.width / b.width}, ${a.height / b.height})`
    moves.push({ node, delay: node.dataset.flip === 'label' ? 0 : Math.min(index, 6) * 16, fade: false })
  })
  document.body.offsetHeight
  requestAnimationFrame(() => {
    moves.forEach(({ node, delay, fade }) => {
      node.style.transition = `transform ${DURATION}ms ${EASE} ${delay}ms${fade ? `, opacity 260ms ${EASE} ${delay}ms` : ''}`
      node.style.transform = 'none'
      if (fade) node.style.opacity = '1'
    })
  })
  window.setTimeout(() => { if (mine === ticket) moves.forEach(({ node }) => clear(node)) }, DURATION + 6 * 16 + 80)
}

export function runMorph(update, active) {
  hold(active)
  const nodes = reduced() ? [] : [...document.querySelectorAll(`[data-slot="${active}"] [data-flip]`)]
  const first = new Map(nodes.map((node) => [node, node.getBoundingClientRect()]))
  flushSync(update)
  if (first.size) play(first)
}
