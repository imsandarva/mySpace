import { contact } from '../src/data/identity.js'
import { site } from '../src/data/site.js'
import { formatDate } from '../src/lib/post/dates.js'
import { excerpt } from '../src/lib/post/excerpt.js'
import { esc, renderDoc } from '../src/lib/post/markup.js'

/* A finished reading page: the same type and chrome as the site, with the essay already in the HTML
   so a link shared to WhatsApp or X has a title, a description, and an image before any JavaScript runs. */

const abs = (p) => new URL(String(p).replace(/^\//, ''), `${site.url}/`).href

const ARROWS = { left: 'M13 8H3M7 4 3 8l4 4', right: 'M3 8h10M9 4l4 4-4 4', out: 'M5 11l6-6M6 5h5v5' }

const arrow = (kind) => {
  const d = ARROWS[kind]
  return `<svg class="arrow is-${kind}" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

const blurb = (post) => {
  const text = (post.subtitle || excerpt(post.doc) || '').replace(/\s+/g, ' ').trim()
  if (!text) return `A piece by ${site.author}.`
  return text.length > 180 ? `${text.slice(0, 177).trim()}…` : text
}

const shell = ({ title, description, cssHref, canonical, image, extra = '', body }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="author" content="${esc(site.author)}" />
  <meta name="theme-color" content="#f8f5ef" />
  <link rel="canonical" href="${esc(canonical)}" />
  ${extra}
  <link rel="stylesheet" href="${esc(cssHref)}" />
</head>
<body class="essay">
  <a class="skip" href="#article">Skip to content</a>
  <header class="site-header is-static">
    <div class="wrap site-header-row">
      <a class="wordmark" href="../../">${esc(site.name)}</a>
      <nav class="site-nav" aria-label="Sections">
        <a href="../../#/writings" aria-current="page">Writings</a>
        <a href="../../#/readings">Readings</a>
      </nav>
    </div>
  </header>
  <main id="article" tabindex="-1">${body}</main>
  <footer class="colophon">
    <div class="wrap colophon-row">
      <a class="wordmark" href="../../">${esc(site.name)}</a>
      <a class="colophon-mail" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>
    </div>
  </footer>
  <script>${SHARE_JS}</script>
</body>
</html>`

/* Progressive enhancement: the button is hidden in the HTML and only appears if this runs. A phone gets its own share sheet;
   everything else copies the address. Feedback is a short phrase, announced, then gone. */
const SHARE_JS = `(()=>{const b=document.querySelector('[data-share]'),s=document.querySelector('[data-share-note]');if(!b)return;const n=navigator,say=m=>{s.textContent=m;setTimeout(()=>{s.textContent=''},2200)};if(n.share)b.textContent='Share';b.hidden=false;b.onclick=async()=>{try{if(n.share)await n.share({title:document.title,url:location.href});else{await n.clipboard.writeText(location.href);say('Link copied')}}catch(e){if(e.name!=='AbortError')say('Couldn\\u2019t copy the link')}}})()`

/* The ending: a hairline, a few next pieces as plain typography, the way back, and a quiet way to pass the link on. */
const more = (items) => items.length ? `<h2 class="end-label">More writing</h2>
      <ul class="more-list">${items.map((w) => `<li><a href="${esc(w.href)}"${w.external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="more-title">${esc(w.title)}${w.external ? arrow('out') : ''}</span>${w.blurb ? `<span class="more-blurb">${esc(w.blurb)}</span>` : ''}</a></li>`).join('')}</ul>` : ''

const ending = (items) => `<footer class="piece-end">
      ${more(items)}
      <div class="end-row">
        <a class="end-all" href="../../#/writings">${arrow('left')}All writings</a>
        <span class="end-share-group"><span class="end-note" data-share-note role="status" aria-live="polite"></span><button type="button" class="end-share" data-share hidden>Copy link</button></span>
      </div>
    </footer>`

const tags = (post, description, canonical, image) => {
  const json = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description,
    datePublished: post.published, dateModified: post.updatedAt || post.published,
    author: { '@type': 'Person', name: site.author }, image, mainEntityOfPage: canonical,
  }).replace(/</g, '\\u003c')
  return `<meta property="og:type" content="article" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:title" content="${esc(post.title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(post.title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <meta property="article:published_time" content="${esc(post.published)}" />
  <script type="application/ld+json">${json}</script>`
}

export const renderArticle = ({ post, cssHref, edit = false, more: next = [] }) => {
  const description = blurb(post)
  const canonical = abs(`writing/${post.slug}/`)
  const image = post.og ? abs(`writing/${post.slug}/${post.og}`) : abs('assets/og-default.webp')
  const body = `<article class="piece">
    <div class="piece-wrap">
      <header class="piece-head">
        <p class="piece-meta"><time datetime="${esc(post.published)}">${esc(formatDate(post.published))}</time>${edit ? `<a class="piece-edit" href="../../#/write/${esc(post.id)}">Edit</a>` : ''}</p>
        <h1 class="piece-title">${esc(post.title)}</h1>
        ${post.subtitle ? `<p class="piece-dek">${esc(post.subtitle)}</p>` : ''}
      </header>
      <div class="prose">${renderDoc(post.doc, (src) => `./${src}`)}</div>
      ${ending(next)}
    </div>
  </article>`
  return shell({ title: `${post.title} — ${site.name}`, description, cssHref, canonical, image, extra: tags(post, description, canonical, image), body })
}

export const renderMissing = (cssHref) => shell({
  title: `Not found — ${site.name}`,
  description: site.description,
  cssHref,
  canonical: abs(''),
  image: abs('assets/og-default.webp'),
  body: `<article class="piece"><div class="piece-wrap"><a class="back" href="../../">${arrow('left')}Home</a><h1 class="piece-title">This piece isn’t here.</h1><p class="piece-dek">It may have been unpublished, or the link is mistyped.</p></div></article>`,
})
