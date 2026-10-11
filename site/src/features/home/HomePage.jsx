import ReadingsPreview from '../readings/ReadingsPreview'
import WritingsPreview from '../writings/WritingsPreview'
import Hero from './Hero'

/* The front page, in reading order: who, what I think, what I read. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WritingsPreview />
      <ReadingsPreview />
    </>
  )
}
