import { useSyncExternalStore } from 'react'

/* Which book is open in the focused view. A tiny external store: the collection, the archive and the focus layer all read it,
   and nothing touches the URL — focusing a book is a state of the current page, not a navigation.
   Lifecycle: open → (twin ready) → close → (flight home) → release. */

const IDLE = { slug: null, source: null, rest: null, ready: false, closing: false }
let state = IDLE
const subs = new Set()
const set = (next) => { state = next; subs.forEach((l) => l()) }

export const focusStore = {
  open: (slug, source, rest) => set({ slug, source, rest, ready: false, closing: false }),
  ready: () => state.slug && !state.ready && set({ ...state, ready: true }),
  close: () => state.slug && !state.closing && set({ ...state, closing: true }),
  release: () => set(IDLE),
}

export const useFocus = () => useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb) }, () => state)
