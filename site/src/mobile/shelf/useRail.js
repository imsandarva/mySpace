import { useEffect, useRef } from 'react'

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Snap rail: right-edge fade only while more remains, and a quiet focus falloff for writing cards. */
export function useRail(live) {
  const ref = useRef(null)

  useEffect(() => {
    const rail = ref.current
    if (!rail || !live) return
    let frame = 0
    const apply = () => {
      frame = 0
      const more = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2
      rail.classList.toggle('is-more', more)
      if (reduced()) return
      const origin = rail.getBoundingClientRect().left + (parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0)
      rail.querySelectorAll('[data-focus]').forEach((item) => {
        const rect = item.getBoundingClientRect()
        const away = Math.min(1, Math.abs(rect.left - origin) / Math.max(rect.width, 1))
        item.style.setProperty('--away', away.toFixed(3))
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply) }
    apply()
    rail.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { rail.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [live])

  const onKeyDown = (event) => {
    const rail = ref.current
    if (!rail || !live) return
    const { key } = event
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return
    const items = [...rail.children]
    if (!items.length) return
    const current = items.findIndex((item) => item.contains(document.activeElement))
    const next = key === 'Home' ? 0 : key === 'End' ? items.length - 1 : current + (key === 'ArrowRight' ? 1 : -1)
    if (next < 0 || next >= items.length || next === current) return
    event.preventDefault()
    const target = items[next].querySelector('a, button')
    target?.focus({ preventScroll: true })
    items[next].scrollIntoView({ inline: 'start', block: 'nearest' })
  }

  return { ref, onKeyDown }
}
