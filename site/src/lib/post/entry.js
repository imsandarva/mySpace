import { formatDate } from './dates.js'
import { excerpt } from './excerpt.js'
import { firstFigure } from './figures.js'

/* What the writings list needs from a piece. The document itself stays out of the site bundle. */
export const toEntry = (post) => {
  if (!post?.slug || !post.title?.trim()) return null
  const fig = firstFigure(post.doc)
  const small = fig?.srcset?.match(/images\/[a-f0-9]{16}-800\.webp/)?.[0]
  const thumb = small || fig?.src
  return {
    id: post.id,
    slug: post.slug,
    title: post.title.trim(),
    subtitle: post.subtitle?.trim() || excerpt(post.doc),
    published: post.published,
    date: formatDate(post.published),
    url: `writing/${post.slug}/`,
    local: true,
    ...(thumb ? { thumb: `writing/${post.slug}/${thumb}` } : {}),
  }
}
