import { useEffect } from 'react'
import { routeTitle } from './routes'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

/* The frame every page lives in: skip link, header, content, footer. */
export default function Shell({ route, children }) {
  useEffect(() => { document.title = routeTitle(route.name) }, [route.name])

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <SiteHeader route={route} />
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </>
  )
}
