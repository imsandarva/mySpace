/* Whether "back" would stay on this site: true once the visitor has pushed a navigation inside the app.
   Replacing the current entry (stepping between books) does not count — it adds no history. */
let inside = false
let replacing = false

export const markInside = () => { if (replacing) replacing = false; else inside = true }
export const cameFromInside = () => inside

export function replaceTo(href) {
  replacing = true
  window.location.replace(href)
}
