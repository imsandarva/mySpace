/* Scroll policy for a route change: the front page resumes where you left it; every other page starts at the top.
   `saved` holds the front page's position, recorded on the way out. */
export const applyScroll = (route, saved) => window.scrollTo(0, route.name === 'home' ? saved.get('home') ?? 0 : 0)

export const shouldSave = (from) => from.name === 'home'
