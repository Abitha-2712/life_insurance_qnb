import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@/core/i18n/t'
import './FilterDropdown.css'

function CircleCheck({ checked }) {
  return (
    <span className={`ui-filter-circle${checked ? ' is-checked' : ''}`} aria-hidden="true">
      {checked ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 12.5l4 4 8-9"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

function FilterDropdown({
  column,
  columnLabel,
  options = [],
  selections,
  onChange,
  open,
  onClose,
  anchorRef,
}) {
  const panelRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const selected = selections && selections.size ? selections : new Set(['ALL'])

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return options.filter((option) => {
      if (option === 'ALL') return true
      if (!q) return true
      return String(option).toLowerCase().includes(q)
    })
  }, [options, searchQuery])

  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      return undefined
    }
    function onDoc(e) {
      if (panelRef.current?.contains(e.target)) return
      if (anchorRef?.current?.contains(e.target)) return
      onClose?.()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose, anchorRef])

  if (!open) return null

  function pick(option) {
    if (option === 'ALL') {
      onChange?.(column, new Set(['ALL']))
      onClose?.()
      return
    }
    onChange?.(column, new Set([option]))
    onClose?.()
  }

  function clear() {
    onChange?.(column, new Set(['ALL']))
    onClose?.()
  }

  const title = columnLabel || column

  return (
    <div className="ui-filter-dropdown" ref={panelRef} role="dialog">
      <div className="ui-filter-dropdown-header">
        <span className="ui-filter-dropdown-title">
          {t('Filter', 'Filter')} {title}
        </span>
        {!selected.has('ALL') ? (
          <button type="button" className="ui-filter-dropdown-clear" onClick={clear}>
            {t('Clear', 'Clear')}
          </button>
        ) : null}
      </div>
      <div className="ui-filter-dropdown-divider" />
      <div className="ui-filter-dropdown-search-wrap">
        <svg className="ui-filter-dropdown-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          className="ui-filter-dropdown-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Search', 'Search')}
        />
      </div>
      <ul className="ui-filter-dropdown-list">
        {filteredOptions.map((option) => {
          const active = selected.has(option) || (option === 'ALL' && selected.has('ALL'))
          return (
            <li key={option}>
              <button
                type="button"
                className={active ? 'is-active' : ''}
                onClick={() => pick(option)}
              >
                <CircleCheck checked={active} />
                <span>{option === 'ALL' ? t('ALL', 'ALL') : option}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterDropdown
