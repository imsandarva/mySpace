import { useCallback, useEffect, useRef, useState } from 'react'
import { playFormation } from '../lib/playFormation'
import { formedRect } from '../lib/fragments'

const KEY = 'museum-formed'
const HOLD_MS = 380
const SETTLE_MS = 880

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const seen = () => Boolean(sessionStorage.getItem(KEY))

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function invertToFormed(img, slot) {
  const formed = formedRect(window.innerWidth, window.innerHeight)
  const box = slot.getBoundingClientRect()
  const dx = formed.x - box.left
  const dy = formed.y - box.top
  const sx = formed.w / box.width
  img.style.transition = 'none'
  img.style.transformOrigin = 'top left'
  img.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sx})`
}

function introOn() { document.body.classList.add('is-intro') }
function introOff() { document.body.classList.remove('is-intro', 'is-forming'); document.body.style.overflow = '' }
function formingOn() { document.body.classList.add('is-forming'); document.body.style.overflow = 'hidden'; introOn() }

/* Session-aware formation: once per visit, skippable, reduced-motion safe. */
export function usePortraitFormation(src) {
  const canvasRef = useRef(null)
  const slotRef = useRef(null)
  const imgRef = useRef(null)
  const ctl = useRef(null)
  const [phase, setPhase] = useState(() => (seen() || reduced() ? 'done' : 'boot'))

  const finish = useCallback(() => {
    sessionStorage.setItem(KEY, '1')
    introOff()
    setPhase('done')
  }, [])

  const settle = useCallback(() => {
    const img = imgRef.current
    const slot = slotRef.current
    if (!img || !slot) { finish(); return }
    document.body.classList.remove('is-forming')
    setPhase('settling')
    invertToFormed(img, slot)
    img.offsetHeight
    requestAnimationFrame(() => {
      img.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      img.style.transform = 'none'
    })
    window.setTimeout(finish, SETTLE_MS + 40)
  }, [finish])

  useEffect(() => {
    if (seen() || reduced()) return

    let holdTimer = 0
    let open = true
    let layer = null
    formingOn()
    setPhase('forming')

    const skip = (e) => {
      if (!open) return
      if (e?.type === 'wheel' && Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return
      open = false
      window.clearTimeout(holdTimer)
      ctl.current?.skip()
      settle()
    }

    const onKey = (e) => skip(e)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('keydown', onKey)

    const start = async () => {
      try {
        const image = await loadImage(src)
        if (!open) return
        await new Promise((res) => {
          const wait = () => (canvasRef.current ? res() : requestAnimationFrame(wait))
          wait()
        })
        if (!open || !canvasRef.current) return
        layer = canvasRef.current.parentElement
        layer?.addEventListener('pointerdown', skip, { passive: true })
        ctl.current = playFormation(canvasRef.current, image, {
          onComplete() {
            if (!open) return
            setPhase('holding')
            holdTimer = window.setTimeout(() => { if (open) { open = false; settle() } }, HOLD_MS)
          },
        })
      } catch { finish() }
    }

    start()

    return () => {
      open = false
      ctl.current?.stop()
      window.clearTimeout(holdTimer)
      layer?.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('keydown', onKey)
      introOff()
    }
  }, [src, settle, finish])

  return { phase, canvasRef, slotRef, imgRef }
}
