import { useSyncExternalStore } from 'react'
import { books } from '../../../lib/books'
import { canRender3D } from '../three/capability'

/* Loads the 3D layer and shares it with every book on the page. The status is one of:
   'loading' — on its way (slots stay empty, boxes already reserved), 'ready' — { api }, 'unsupported' — no WebGL or the load failed
   (slots show a flat cover instead). There is never a stand-in that is later swapped for the real thing. */

let state = canRender3D() ? { status: 'loading', api: null } : { status: 'unsupported', api: null }
let started = false
let warm = Promise.resolve()
const listeners = new Set()
const set = (next) => { state = next; listeners.forEach((l) => l()) }

/* Resolves once every archive cover is painted, so opening "All books" can show them in the first frame. */
export const readingsReady = () => warm

function start() {
  if (started || state.status !== 'loading') return
  started = true
  warm = import('../three')
    .then((api) => { set({ status: 'ready', api }); return api.warmCollection(books) })
    .catch(() => { set({ status: 'unsupported', api: null }) })
}

const subscribe = (cb) => { listeners.add(cb); start(); return () => listeners.delete(cb) }

export const useBookEngine = () => useSyncExternalStore(subscribe, () => state)
