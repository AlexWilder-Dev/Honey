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
  lit?: boolean
}

const base = `${import.meta.env.BASE_URL}img/`

export function Img({ k, sizes, className = '', position, priority, alt, lit }: Props) {
  const im = images[k]
  const [loaded, setLoaded] = useState(false)
  const srcSet = im.widths.map((w) => `${base}${k}-${w}.webp ${w}w`).join(', ')
  return (
    <picture className={`img ${lit ? 'img--lit' : ''} ${className}`} style={{ backgroundImage: `url(${im.blur})` }}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`${base}${k}-${im.fallback}.jpg`}
        alt={alt ?? im.alt}
        width={im.width}
        height={im.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={position ? { objectPosition: position } : undefined}
        className={loaded ? 'is-loaded' : undefined}
        ref={(el) => {
          if (el?.complete && el.naturalWidth && !loaded) setLoaded(true)
        }}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  )
}
