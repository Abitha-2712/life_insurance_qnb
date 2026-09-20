import { useMemo } from 'react'
import './UISummaryStatusRow.css'

const TONES = {
  all: 'total',
  total: 'total',
  active: 'active',
  inactive: 'inactive',
}

/**
 * Flutter `SummaryStatusRow` — Total / Active / Inactive count cards.
 *
 * Prefer counts + labels (Flutter API), or pass `items` with
 * `{ key: 'all'|'active'|'inactive', label, count }` for existing pages.
 *
 * `value` / `onChange` use tokens: `all` | `active` | `inactive`
 * (Flutter null filter ≡ `all`).
 */
function UISummaryStatusRow({
  items,
  totalCount,
  activeCount,
  inactiveCount,
  totalLabel = 'Total',
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  value = 'all',
  selectedFilter,
  onChange,
  onFilterChanged,
  className = '',
}) {
  const cards = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return items.map((item) => {
        const key = String(item.key ?? item.id ?? '')
        const tone = TONES[key.toLowerCase()] || 'total'
        return {
          key: key || tone,
          label: item.label,
          count: Number(item.count ?? 0),
          tone,
        }
      })
    }

    const total = Number(totalCount ?? 0)
    const active = Number(activeCount ?? 0)
    const inactive =
      inactiveCount != null ? Number(inactiveCount) : Math.max(0, total - active)

    return [
      { key: 'all', label: totalLabel, count: total, tone: 'total' },
      { key: 'active', label: activeLabel, count: active, tone: 'active' },
      { key: 'inactive', label: inactiveLabel, count: inactive, tone: 'inactive' },
    ]
  }, [
    items,
    totalCount,
    activeCount,
    inactiveCount,
    totalLabel,
    activeLabel,
    inactiveLabel,
  ])

  const selected =
    selectedFilter === null || selectedFilter === undefined
      ? value ?? 'all'
      : selectedFilter === 'Active'
        ? 'active'
        : selectedFilter === 'Inactive'
          ? 'inactive'
          : String(selectedFilter || 'all')

  function handleSelect(key) {
    onChange?.(key)
    if (onFilterChanged) {
      if (key === 'all' || key === 'total') onFilterChanged(null)
      else if (key === 'active') onFilterChanged('Active')
      else if (key === 'inactive') onFilterChanged('Inactive')
      else onFilterChanged(key)
    }
  }

  return (
    <div className={['ui-summary-status-row', className].filter(Boolean).join(' ')}>
      {cards.map((card) => {
        const isSelected = String(selected) === String(card.key)
        return (
          <button
            key={card.key}
            type="button"
            className={[
              'ui-summary-status-card',
              `tone-${card.tone}`,
              isSelected ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleSelect(card.key)}
            aria-pressed={isSelected}
          >
            <span className="ui-summary-status-label">{card.label}</span>
            <span className="ui-summary-status-count">{card.count}</span>
          </button>
        )
      })}
    </div>
  )
}

export default UISummaryStatusRow
