/* Shelf hover “top” — synthesized, no samples. */

let ctx = null
let tapBuf = null
let hold = null
let bound = false

const START = 1180
const END = 1480
const PEAK = 0.065
const TAP = 0.04
const DUR = 0.055

const prefersQuiet = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const Ctor = () => window.AudioContext || window.webkitAudioContext
const isLive = (ac) => ac?.state === 'running'

function ensureCtx() {
  if (ctx) return ctx
  if (typeof window === 'undefined' || !Ctor()) return null
  try { ctx = new (Ctor())() }
  catch { return null }
  return ctx
}

function holdOpen(ac) {
  if (hold || !isLive(ac)) return
  try {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.frequency.value = 1
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start()
    hold = osc
  } catch { hold = null }
}

function prime(ac) {
  try {
    const src = ac.createBufferSource()
    src.buffer = ac.createBuffer(1, 1, ac.sampleRate)
    src.connect(ac.destination)
    src.start(0)
  } catch { /* suspended contexts reject start(); resume() handles that */ }
}

function tapBuffer(ac) {
  if (tapBuf && tapBuf.sampleRate === ac.sampleRate) return tapBuf
  const n = Math.max(1, Math.floor(ac.sampleRate * 0.028))
  const buf = ac.createBuffer(1, n, ac.sampleRate)
  const data = buf.getChannelData(0)
  let brown = 0
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1
    brown = 0.97 * brown + 0.03 * white
    data[i] = (white * 0.5 + brown * 0.5) * Math.exp(-i / (n * 0.26))
  }
  tapBuf = buf
  return tapBuf
}

function chirp(ac, t0, tilt) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(START + tilt, t0)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, END + tilt * 0.6), t0 + DUR)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(PEAK, t0 + 0.0015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + DUR)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + DUR + 0.012)
}

function tap(ac, t0) {
  const src = ac.createBufferSource()
  const bp = ac.createBiquadFilter()
  const gain = ac.createGain()
  src.buffer = tapBuffer(ac)
  bp.type = 'bandpass'
  bp.frequency.value = 2100
  bp.Q.value = 1.15
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(TAP, t0 + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.036)
  src.connect(bp)
  bp.connect(gain)
  gain.connect(ac.destination)
  src.start(t0)
  src.stop(t0 + 0.04)
}

function fire(ac) {
  if (!isLive(ac)) return
  const t0 = ac.currentTime + 0.004
  const tilt = (Math.random() - 0.5) * 70
  chirp(ac, t0, tilt)
  tap(ac, t0)
}

function wake(ac) {
  if (!ac) return Promise.resolve(null)
  const after = () => { prime(ac); holdOpen(ac); return ac }
  if (isLive(ac)) return Promise.resolve(after())
  return ac.resume().then(after).catch(() => ac)
}

export function armShelfTone() {
  if (prefersQuiet()) return
  wake(ensureCtx())
}

export function playShelfDop() {
  if (prefersQuiet()) return
  const ac = ensureCtx()
  if (!ac) return
  if (isLive(ac)) { fire(ac); return }
  wake(ac).then((live) => { if (isLive(live)) fire(live) })
}

export function bindShelfToneUnlock() {
  if (bound || typeof document === 'undefined') return
  bound = true
  const arm = () => armShelfTone()
  const opts = { capture: true, passive: true }
  document.addEventListener('pointerdown', arm, opts)
  document.addEventListener('keydown', arm, opts)
}
