import { Img } from '../components/Img'

/** One photograph, full width, and a line. */
export function Interlude() {
  return (
    <figure className="interlude">
      <Img k="courtyard-night" sizes="100vw" position="50% 42%" />
      <figcaption className="wrap">The courtyard, after dark.</figcaption>
    </figure>
  )
}
