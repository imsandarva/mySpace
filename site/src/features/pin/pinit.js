/* Official Pinterest add-on — one pinit.js per page, then PinUtils.build(). */

const SRC = 'https://assets.pinterest.com/js/pinit.js'

function hasUtils() {
  return typeof window !== 'undefined' && typeof window.PinUtils?.build === 'function'
}

function inject() {
  if (document.querySelector('script[data-pin-script]')) return
  const script = document.createElement('script')
  script.src = SRC
  script.async = true
  script.defer = true
  script.dataset.pinScript = 'true'
  document.body.appendChild(script)
}

export function loadPinit() {
  if (hasUtils()) return Promise.resolve(window.PinUtils)
  inject()
  return new Promise((resolve) => {
    const tick = () => { hasUtils() ? resolve(window.PinUtils) : requestAnimationFrame(tick) }
    tick()
  })
}

export function buildPins() {
  return loadPinit().then((pin) => { pin.build(); return pin })
}

export function sweepPinSiblings(host) {
  if (!host) return
  let node = host.nextSibling
  while (node && isPinChrome(node)) {
    const gone = node
    node = node.nextSibling
    gone.remove()
  }
}

function isPinChrome(node) {
  if (node.nodeType !== 1) return false
  const cls = node.className?.toString?.() ?? ''
  return node.tagName === 'IFRAME' || node.tagName === 'SPAN' || cls.includes('PIN_')
}
