import HomePage from '../features/home/HomePage'
import PinPreview from '../features/pin/PinPreview'
import ReadingsPage from '../features/readings/ReadingsPage'
import WritingsPage from '../features/writings/WritingsPage'

/* Route name → page. Adding a page is one line here plus one row in routes.js. */
export const views = {
  home: HomePage,
  writings: WritingsPage,
  readings: ReadingsPage,
  pin: PinPreview,
}

/* Pages that render their own chrome instead of the site shell. */
export const bare = new Set(['pin', ...(import.meta.env.DEV ? ['write'] : [])])
