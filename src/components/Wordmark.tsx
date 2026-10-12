/** Their wordmark as it appears on the signs and menus: Hive set in, Honey below, a swash ampersand between. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__hive" aria-hidden="true">Hive</span>
      <span className="wordmark__amp" aria-hidden="true">&amp;</span>
      <span className="wordmark__honey" aria-hidden="true">Honey</span>
      <span className="sr-only">Hive &amp; Honey</span>
    </span>
  )
}
