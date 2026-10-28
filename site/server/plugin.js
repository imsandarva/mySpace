import { toEntry } from '../src/lib/post/entry.js'
import { listPublished } from './store.js'
import { hostOk, isLoopback, originOk, send } from './http.js'
import { handle } from './handlers.js'

/* Dev-only writer. `configureServer` never runs during `vite build`, so none of these routes exist on the live site.
   Hiding a button is not the safeguard; the route not existing is. */

const VIRTUAL = 'virtual:published-posts'
const RESOLVED = `\0${VIRTUAL}`

const guard = (req, res) => {
  if (isLoopback(req) && hostOk(req) && originOk(req)) return true
  send(res, 403, { error: 'Writing is only available on this computer.' })
  return false
}

export default function writings() {
  return {
    name: 'writings',
    resolveId(id) { if (id === VIRTUAL) return RESOLVED },
    async load(id) {
      if (id !== RESOLVED) return
      const entries = (await listPublished()).map(toEntry).filter(Boolean)
      return `export default ${JSON.stringify(entries)}\n`
    },
    configureServer(server) {
      const touch = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1')
        const path = url.pathname
        const ours = path.startsWith('/api/write') || path.startsWith('/media/draft/') || path.startsWith('/writing/')
        if (!ours) return next()
        if (!guard(req, res)) return
        const action = url.pathname.split('/').pop()
        handle(req, res, url).then((taken) => {
          if (taken && req.method === 'POST' && (action === 'publish' || action === 'unpublish' || action === 'delete')) touch()
          if (!taken && !res.headersSent) next()
        }).catch((err) => {
          if (res.headersSent) return
          if (!err.status) console.error(err)
          send(res, err.status || 500, { error: err.status ? err.message : 'Something went wrong.' })
        })
      })
    },
  }
}
