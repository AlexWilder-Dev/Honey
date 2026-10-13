import type { MenuItem } from '../data/menu'
import { money } from '../lib/format'

/** One line of a printed menu: name, dotted leader, price; what's in it underneath. */
export function DishRow({ item, size = 'small', note }: { item: MenuItem; size?: 'big' | 'small'; note?: { quote: string; by: string } }) {
  return (
    <li className={`dish dish--${size}`}>
      <p className="dish__line">
        <span className="dish__name">
          {item.name}
          {item.units && <span className="dish__units"> ×{item.units}</span>}
          {item.diet && (
            <abbr className="dish__diet" title="Vegetarian">
              {item.diet}
            </abbr>
          )}
        </span>
        <span className="dish__leader" aria-hidden="true" />
        <span className="dish__prices">
          {item.prices.map((p, i) => (
            <span key={i} className="dish__price">
              {p.label && <span className="dish__label">{p.label}</span>}
              {money(p.amount)}
            </span>
          ))}
        </span>
      </p>
      {item.with.length > 0 && <p className="dish__with">{item.with.join(', ')}</p>}
      {item.note && <p className="dish__note">{item.note}</p>}
      {note && (
        <p className="dish__press">
          {note.quote} <cite>{note.by}</cite>
        </p>
      )}
    </li>
  )
}
