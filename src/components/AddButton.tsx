import { useTable } from '../state/table'

type Props = { id: string; name: string; priceIndex?: number; label?: string; size?: 'big' | 'small' }

/** "+" that pours itself full once the item is on your table. */
export function AddButton({ id, name, priceIndex = 0, label, size = 'small' }: Props) {
  const { add, qtyOf } = useTable()
  const qty = qtyOf(id, priceIndex)
  const what = `${name}${label ? `, ${label.toLowerCase()}` : ''}`
  return (
    <button
      type="button"
      className={`add add--${size} ${qty ? 'add--on' : ''}`}
      onClick={() => add(id, priceIndex)}
      aria-label={qty ? `Add another ${what} (${qty} on your table)` : `Add ${what} to your table`}
    >
      <span className="add__fill" aria-hidden="true" />
      <svg className="add__plus" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {qty > 0 && (
        <span className="add__qty" aria-hidden="true" key={qty}>
          {qty}
        </span>
      )}
    </button>
  )
}
