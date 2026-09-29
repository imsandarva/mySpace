/* Shelf hover tick — prebaked WAV + HTMLAudio pool (no AudioContext on load). */

const POOL = 4
const VOL = 0.46
const GESTURES = ['pointerdown', 'mousedown', 'click', 'keydown', 'touchend', 'pointerup', 'contextmenu']

let src = ''
let voices = null
let slot = 0
let bound = false
let hovering = false

const quiet = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function writeStr(view, offset, text) {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
}

function pcmToWav(samples, rate) {
  const n = samples.length
  const bytes = new ArrayBuffer(44 + n * 2)
  const view = new DataView(bytes)
  writeStr(view, 0, 'RIFF')
  view.setUint32(4, 36 + n * 2, true)
  writeStr(view, 8, 'WAVE')
  writeStr(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(view, 36, 'data')
  view.setUint32(40, n * 2, true)
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Blob([bytes], { type: 'audio/wav' })
}

function renderDop() {
  const sr = 44100
  const n = Math.floor(sr * 0.058)
  const out = new Float32Array(n)
  let phase = 0
  let brown = 0
  for (let i = 0; i < n; i++) {
    const p = i / n
    const freq = 1180 + 300 * p
    phase += (Math.PI * 2 * freq) / sr
    const env = Math.exp(-p * 8.5) * (p < 0.05 ? p / 0.05 : 1)
    const white = Math.random() * 2 - 1
    brown = 0.97 * brown + 0.03 * white
    const tap = Math.exp(-i / (sr * 0.012)) * (white * 0.32 + brown * 0.22)
    out[i] = Math.sin(phase) * env * 0.74 + tap * 0.26
  }
  return out
}

function makeVoice() {
  const el = new Audio(src)
  el.preload = 'auto'
  el.volume = VOL
  return el
}

function pool() {
  if (voices) return voices
  src = URL.createObjectURL(pcmToWav(renderDop(), 44100))
  voices = Array.from({ length: POOL }, makeVoice)
  return voices
}

function hit() {
  if (quiet()) return
  const el = pool()[slot++ % POOL]
  el.muted = false
  el.volume = VOL
  try { el.currentTime = 0 } catch { /* some engines throw if not ready */ }
  const play = el.play()
  if (play) play.catch(() => {})
}

function unlock() {
  pool().forEach((el) => {
    el.muted = true
    const play = el.play()
    if (play) play.then(() => { el.pause(); el.currentTime = 0; el.muted = false }).catch(() => { el.muted = false })
    else el.muted = false
  })
  if (hovering) hit()
}

export function setShelfHovering(on) {
  hovering = on
}

export function playShelfDop() {
  hit()
}

export function bindShelfToneUnlock() {
  if (bound || typeof document === 'undefined') return
  bound = true
  pool()
  const onGesture = () => unlock()
  const opts = { capture: true, passive: true }
  GESTURES.forEach((name) => document.addEventListener(name, onGesture, opts))
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    voices?.forEach((el) => { el.pause(); el.src = '' })
    if (src) URL.revokeObjectURL(src)
    voices = null
    src = ''
    bound = false
  })
}
