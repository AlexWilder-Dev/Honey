import type { MenuItem } from '../data/menu'
import { money } from '../lib/format'
import { AddButton } from './AddButton'

/** One line of the menu: name, what's in it, price(s) and a + for each price. */
export function DishRow({ item, size = 'small', note }: { item: MenuItem; size?: 'big' | 'small'; note?: { quote: string; by: string } }) {
  return (
    <li className={`dish dish--${size} ${item.prices.length > 1 ? 'dish--multi' : ''}`}>
      <div className="dish__text">
        <h4 className="dish__name">
          {item.name}
          {item.units && <span className="dish__units"> ×{item.units}</span>}
          {item.diet && (
            <abbr className="dish__diet" title="Vegetarian">
              {item.diet}
            </abbr>
          )}
        </h4>
        {item.with.length > 0 && (
          <p className="dish__with">
            {item.with.map((w, i) => (
              <span key={i}>
                {i > 0 && <span className="dish__sep" aria-hidden="true"> / </span>}
                {w}
              </span>
            ))}
          </p>
        )}
        {item.note && <p className="dish__note">{item.note}</p>}
        {note && (
          <p className="dish__press">
            {note.quote} <cite>{note.by}</cite>
          </p>
        )}
      </div>
      <div className="dish__buy">
        {item.prices.map((p, i) => (
          <div className="dish__price" key={i}>
            {p.label && <span className="dish__label">{p.label}</span>}
            <span className="dish__amount">{money(p.amount)}</span>
            <AddButton id={item.id} name={item.name} priceIndex={i} label={p.label} size={size} />
          </div>
        ))}
      </div>
    </li>
  )
}
