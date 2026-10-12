/* Can this device render the 3D books? Needs WebGL2, and respects the visitor's data-saver choice.
   When it can't, slots show a flat cover instead — nothing breaks, nothing is blank. */
let verdict

export function canRender3D() {
  if (verdict !== undefined) return verdict
  try {
    if (navigator.connection?.saveData) return (verdict = false)
    const gl = document.createElement('canvas').getContext('webgl2')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    verdict = !!gl
  } catch { verdict = false }
  return verdict
}
