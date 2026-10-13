import { useState } from 'react'
import images from '../data/images.json'

export type ImageKey = keyof typeof images

type Props = {
  k: ImageKey
  sizes: string
  className?: string
  position?: string
  priority?: boolean
  alt?: string
}

const base = `${import.meta.env.BASE_URL}img/`
/** Photos already shown once; they come back without fading in again (e.g. switching tabs). */
const seen = new Set<string>()

export function Img({ k, sizes, className = '', position, priority, alt }: Props) {
  const im = images[k]
  const [loaded, setLoaded] = useState(() => seen.has(k))
  const done = () => {
    seen.add(k)
    setLoaded(true)
  }
  const srcSet = im.widths.map((w) => `${base}${k}-${w}.webp ${w}w`).join(', ')
  return (
    <picture className={`img ${loaded ? 'is-loaded' : ''} ${className}`} style={loaded ? undefined : { backgroundImage: `url(${im.blur})` }}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`${base}${k}-${im.fallback}.jpg`}
        alt={alt ?? im.alt}
        width={im.width}
        height={im.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        fetchPriority={priority ? 'high' : 'auto'}
        style={position ? { objectPosition: position } : undefined}
        ref={(el) => {
          if (el?.complete && el.naturalWidth && !loaded) done()
        }}
        onLoad={done}
      />
    </picture>
  )
}
