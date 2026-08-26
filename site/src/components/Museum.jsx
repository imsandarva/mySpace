import Wayfinder from './Wayfinder'
import Opening from './rooms/Opening'
import About from './rooms/About'
import Now from './rooms/Now'
import Books from './rooms/Books'
import Photos from './rooms/Photos'
import Writings from './rooms/Writings'
import Closing from './rooms/Closing'

/* Composition layer — the museum is the whole site. */
export default function Museum() {
  return (
    <>
      <Wayfinder />
      <main>
        <Opening />
        <About />
        <Now />
        <Books />
        <Photos />
        <Writings />
        <Closing />
      </main>
    </>
  )
}
