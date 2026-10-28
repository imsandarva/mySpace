/* Keyboard hints should name the key this machine has. */
export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const MOD = isMac ? '⌘' : 'Ctrl'
export const hint = (label, key) => `${label} (${MOD} ${key})`

/* Plain custom events let sibling controls (the slash key, ⌘K) reach a menu without lifting its state into the editor. */
export const emit = (name) => window.dispatchEvent(new CustomEvent(name))
export const on = (name, fn) => { window.addEventListener(name, fn); return () => window.removeEventListener(name, fn) }
