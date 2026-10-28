import Pill from '../../ui/Pill'
import '../../styles/drafts.css'
import { useDraftCount } from './useDraftCount'

/* Dev-only. Imported behind `import.meta.env.DEV`, so this file is absent from the production bundle. */
export default function AuthorBar() {
  const count = useDraftCount()
  return (
    <div className="author-bar">
      <Pill href="#/drafts">Drafts{count > 0 ? <span className="pill-n">{count}</span> : null}</Pill>
      <Pill href="#/write" tone="primary">+ Write</Pill>
    </div>
  )
}
