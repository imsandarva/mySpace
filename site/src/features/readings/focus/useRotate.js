import { useRef, useState } from 'react'

/* Drag (mouse, pen or touch) and arrow keys turn the focused book. Handlers go on the element that holds the book;
   it sets `touch-action: none`, so a drag there rotates instead of scrolling the page — everywhere else the page scrolls normally. */
const STEP = 0.2

export function useRotate(rigRef) {
  const start = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)

  const onPointerDown = (e) => {
    if (e.button > 0 || !rigRef.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = [e.clientX, e.clientY]
    setDragging(true); setTouched(true)
  }
  const onPointerMove = (e) => {
    if (!start.current) return
    rigRef.current?.rotateBy(e.clientX - start.current[0], e.clientY - start.current[1])
    start.current = [e.clientX, e.clientY]
  }
  const end = () => { start.current = null; setDragging(false) }
  const onKeyDown = (e) => {
    const k = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] }[e.key]
    if (!k || !rigRef.current) return
    e.preventDefault(); rigRef.current.nudge(...k); setTouched(true)
  }

  return { dragging, touched, handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onKeyDown } }
}
