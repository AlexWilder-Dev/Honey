import svg from './monogram.svg?raw'

/** The H&H hexagon monogram from their menus. The only hexagons on the site. */
export function Monogram({ className = '' }: { className?: string }) {
  return <span className={`monogram ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
}
