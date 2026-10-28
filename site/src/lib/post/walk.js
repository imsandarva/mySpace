/* One walk of a piece's document. Callers decide what a node means. */

export const walk = (node, visit) => {
  if (!node || typeof node !== 'object') return
  visit(node)
  if (Array.isArray(node.content)) for (const child of node.content) walk(child, visit)
}
