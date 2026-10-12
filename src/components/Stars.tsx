/** Five stars filled to the rating. */
export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const star = 'M12 2.6l2.83 6.08 6.67.78-4.93 4.56 1.32 6.58L12 17.3l-5.89 3.3 1.32-6.58L2.5 9.46l6.67-.78z'
  return (
    <span className={`stars ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <svg viewBox="0 0 24 24" key={i}>
            <defs>
              <clipPath id={`star-${i}`}>
                <rect width={24 * fill} height="24" />
              </clipPath>
            </defs>
            <path d={star} fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d={star} fill="currentColor" clipPath={`url(#star-${i})`} />
          </svg>
        )
      })}
    </span>
  )
}
