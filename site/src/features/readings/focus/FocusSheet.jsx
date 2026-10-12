import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Arrow from '../../../ui/Arrow'
import BookFlat from '../book/BookFlat'
import BookView from '../view/BookView'
import { useBookEngine } from '../view/engineStore'
import FocusDetails from './FocusDetails'
import FocusTools from './FocusTools'
import { glide, inViewport, invert } from './flip'
import { focusStore } from './focusStore'
import { useRotate } from './useRotate'

const FOCUS_REST = { yaw: 0.42, pitch: 0.19 }
const FLIGHT = 580
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const stageOf = (el) => el?.querySelector('.slot-box')

/* The focused state of one book. Picking it up and putting it back are the same motion in reverse: the book's box flies between
   its place in the collection and its place here (FLIP) while the 3D book inside it eases between poses. Nothing navigates. */
export default function FocusSheet({ book, focus, inline }) {
  const { api, status } = useBookEngine()
  const flat = status === 'unsupported'
  const sheet = useRef(null)
  const box = useRef(null)
  const heading = useRef(null)
  const rig = useRef(null)
  const held = useRef(null)
  const [rigReady, setRigReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const rotate = useRotate(rig)
  const [gaveUp, setGaveUp] = useState(false)
  const ready = flat || rigReady || gaveUp
  const flight = (ms = FLIGHT) => api?.getEngine().invalidateFor(ms + 80)

  /* If the 3D book isn't ready in a moment, carry on with the flat cover rather than leave the visitor waiting. */
  useEffect(() => { const t = setTimeout(() => setGaveUp(true), 1500); return () => clearTimeout(t) }, [])

  /* Before first paint: bring an inline sheet into view, then hold the box where the book was picked up. */
  useLayoutEffect(() => {
    if (inline) { const r = sheet.current.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) sheet.current.scrollIntoView({ block: 'center' }) }
    const from = stageOf(focus.source)?.getBoundingClientRect()
    const to = box.current.getBoundingClientRect()
    if (from && inViewport(from)) { held.current = invert(from, to); box.current.style.transform = held.current }
  }, [])

  /* Once the 3D twin is ready (or there is none to wait for), the shelf copy steps aside and the book flies in. */
  useEffect(() => {
    if (!ready || entered) return
    focusStore.ready()
    flight()
    const land = () => { setEntered(true); heading.current?.focus({ preventScroll: true }) }
    held.current ? glide(box.current, held.current, 'none', FLIGHT, reduced()).then(land) : land()
  }, [ready])

  /* Closing: the same flight, backwards, to wherever the book now sits in the collection; then release. */
  useEffect(() => {
    if (!focus.closing) return
    const done = () => { focusStore.release(); requestAnimationFrame(() => focus.source?.focus({ preventScroll: true })) }
    const to = stageOf(focus.source)?.getBoundingClientRect()
    rig.current?.setRest(focus.rest)
    if (!to || !inViewport(to) || !entered) return void setTimeout(done, reduced() ? 0 : 180)
    flight()
    glide(box.current, 'none', invert(to, box.current.getBoundingClientRect()), FLIGHT, reduced()).then(done)
  }, [focus.closing])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && focusStore.close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* A viewport-filling sheet owns the scroll while it is open. */
  useEffect(() => {
    if (inline) return undefined
    document.documentElement.classList.add('is-locked')
    return () => document.documentElement.classList.remove('is-locked')
  }, [inline])

  const cls = `fl ${inline ? 'is-inline' : 'is-fixed'}${entered ? ' is-entered' : ''}${focus.closing ? ' is-closing' : ''}`

  return (
    <section ref={sheet} className={cls} aria-labelledby="fl-title">
      <div className="fl-inner">
        <button type="button" className="fl-back" onClick={focusStore.close}><Arrow kind="left" />Back to collection</button>
        <div className="fl-grid">
          <div className="fl-book">
            <div ref={box} className="fl-stage" role="group" tabIndex={0} aria-label={`3D view of ${book.title}. Drag, or use the arrow keys, to rotate.`} data-dragging={rotate.dragging} {...rotate.handlers}>
              {(flat || (gaveUp && !rigReady)) && <BookFlat book={book} />}
              <FocusView book={book} box={box} rig={rig} onReady={setRigReady} from={focus.rest} />
            </div>
            <FocusTools touched={rotate.touched} onReset={() => rig.current?.reset()} />
          </div>
          <FocusDetails book={book} headingRef={heading} />
        </div>
      </div>
    </section>
  )
}

function FocusView({ book, box, rig, onReady, from }) {
  return <BookView elRef={box} book={book} tier="lg" mode="focus" rest={FOCUS_REST} from={from} reveal={false} onRig={(r) => { rig.current = r }} onReady={onReady} />
}
