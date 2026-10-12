import { useSyncExternalStore } from 'react'
import { canRender3D } from '../three/capability'

/* Loads the 3D layer and shares it with every book on the page. The status is one of:
   'loading' — on its way (slots stay empty, boxes already reserved), 'ready' — { api }, 'unsupported' — no WebGL or the load failed
   (slots show a flat cover instead). There is never a stand-in that is later swapped for the real thing. */

let state = canRender3D() ? { status: 'loading', api: null } : { status: 'unsupported', api: null }
let started = false
const listeners = new Set()
const set = (next) => { state = next; listeners.forEach((l) => l()) }

function start() {
  if (started || state.status !== 'loading') return
  started = true
  const load = () => import('../three').then((api) => set({ status: 'ready', api })).catch(() => set({ status: 'unsupported', api: null }))
  'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 250 }) : setTimeout(load, 0)
}

const subscribe = (cb) => { listeners.add(cb); start(); return () => listeners.delete(cb) }

export const useBookEngine = () => useSyncExternalStore(subscribe, () => state)
