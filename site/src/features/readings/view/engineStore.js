import { useSyncExternalStore } from 'react'
import { canRender3D } from '../three/capability'

/* Loads the 3D layer lazily — after the page is interactive, never before — and shares it with every book on the page.
   `null` means "not ready (yet, or ever)": components then keep showing their CSS books. */

let api = null
let started = false
const listeners = new Set()

function start() {
  if (started || !canRender3D()) return
  started = true
  const load = () => import('../three').then((m) => { api = m; listeners.forEach((l) => l()) }).catch(() => {})
  'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 300)
}

const subscribe = (cb) => { listeners.add(cb); start(); return () => listeners.delete(cb) }

export const useBookApi = () => useSyncExternalStore(subscribe, () => api)
