/* How the camera fits a book into its box. The renderer (rig.js) and the open/close flight (focus/flip.js)
   both read this, so a book that flies home arrives at the size it actually has on the shelf.
   The book is 1 unit tall. The camera sits slightly low (CAM_Y), which is why the book rides high in its box. */

export const CAM_Y = -0.07

/* World half-height and half-width the camera frames. Focus leaves room to turn; rest fills the slot. */
export const frameWindow = (mode, fill) => (mode === 'focus' ? [0.63, 0.63] : [0.5 / (fill || 0.8), 0.42])

/* The book's rectangle inside a box of this aspect: `h` is its height as a fraction of the box,
   `cy` is its centre from the top, also as a fraction. */
export function bookFootprint(mode, fill, aspect) {
  const [halfH, halfW] = frameWindow(mode, fill)
  const viewH = 2 * Math.max(halfH, halfW / aspect)
  return { h: 1 / viewH, cy: 0.5 + CAM_Y / viewH }
}
