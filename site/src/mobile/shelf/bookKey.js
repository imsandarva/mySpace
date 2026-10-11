/* Stable view-transition ident. Titles are not valid CSS names. */
export function bookKey(title, index) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `b-${index}-${slug}`
}
