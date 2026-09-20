import { useEffect, useMemo, useRef, useState } from 'react'
import UIText from '@/components/ui/UIText/UIText'
import { t } from '@/core/i18n/t'
import './UIDropdown.css'

function normalizeOpt(opt) {
  if (typeof opt === 'string') return { value: opt, label: opt, enabled: true }
  return {
    value: opt?.value,
    label: opt?.label ?? String(opt?.value ?? ''),
    enabled: opt?.enabled !== false,
  }
}

function filterQuery(label, query) {
  const q = String(query || '')
    .toLowerCase()
    .replace(/\s+/g, '')
  if (!q) return true
  return String(label || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(q)
}

function ChevronIcon({ open }) {
  return (
    <svg
      className="ui-dropdown-chevron"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={open ? 'M7 14l5-5 5 5' : 'M7 10l5 5 5-5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Flutter UIDropdownMenu parity — searchable MenuAnchor-style field.
 */
function UIDropdown({
  label,
  value = '',
  onChange,
  options = [],
  placeholder,
  hintText,
  className = '',
  disabled = false,
  readOnly = false,
  enabled,
  error,
  required = false,
  enableSearch = true,
  menuHeight = 300,
}) {
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const locked = enabled === false || disabled || readOnly
  const items = useMemo(() => options.map(normalizeOpt), [options])
  const selected = items.find((o) => String(o.value) === String(value))
  const displayHint = hintText || placeholder || t('Please_select', 'Please select')

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!open) {
      setQuery(selected?.label || '')
      return undefined
    }
    function onDoc(e) {
      if (rootRef.current?.contains(e.target)) return
      closeMenu(true)
    }
    function onKey(e) {
      if (e.key === 'Escape') closeMenu(true)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, selected?.label])

  useEffect(() => {
    setQuery(selected?.label || '')
  }, [selected?.label, value])

  function openMenu() {
    if (locked) return
    setOpen(true)
    setQuery(selected?.label || '')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function closeMenu(revert = false) {
    setOpen(false)
    setFocused(false)
    if (revert) {
      // Flutter: if typed text is not an exact option label, clear after close
      const exact = items.find(
        (o) => o.label.toLowerCase() === String(query || '').trim().toLowerCase(),
      )
      if (!exact && enableSearch) {
        setQuery(selected?.label || '')
      } else if (exact && String(exact.value) !== String(value)) {
        onChange?.(exact.value)
        setQuery(exact.label)
      } else {
        setQuery(selected?.label || '')
      }
    }
  }

  function pick(item) {
    if (!item?.enabled) return
    onChange?.(item.value)
    setQuery(item.label)
    setOpen(false)
    setFocused(false)
  }

  function clearSelection() {
    onChange?.(null)
    setQuery('')
    setOpen(false)
    setFocused(false)
  }

  const filtered = useMemo(() => {
    if (!enableSearch || !open) return items
    const q = query.trim()
    // While typing a search (not exact selected label), filter
    if (!q || (selected && q === selected.label)) return items
    return items.filter((o) => filterQuery(o.label, q))
  }, [items, query, enableSearch, open, selected])

  const showClearRow = enableSearch && open

  return (
    <div
      className={[
        'ui-dropdown',
        className,
        error ? 'has-error' : '',
        locked ? 'is-locked' : '',
        open ? 'is-open' : '',
        focused || open ? 'is-focused' : '',
        value ? 'has-value' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={rootRef}
    >
      {label ? (
        <span className="ui-dropdown-label">
          {label}
          {required ? <span className="ui-dropdown-required">*</span> : null}
        </span>
      ) : null}

      <div className="ui-dropdown-field">
        <input
          ref={inputRef}
          className="ui-dropdown-control"
          value={open && enableSearch ? query : selected?.label || ''}
          placeholder={displayHint}
          readOnly={!enableSearch || locked}
          disabled={false}
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-haspopup="listbox"
          onFocus={() => {
            if (locked) return
            setFocused(true)
            openMenu()
          }}
          onClick={() => {
            if (locked) return
            if (!open) openMenu()
          }}
          onChange={(e) => {
            if (locked || !enableSearch) return
            const next = e.target.value
            setQuery(next)
            if (!open) setOpen(true)
            if (!next.trim()) {
              onChange?.(null)
            }
          }}
        />
        <button
          type="button"
          className="ui-dropdown-suffix"
          tabIndex={-1}
          disabled={locked}
          aria-label={open ? t('Close', 'Close') : t('Open', 'Open')}
          onClick={(e) => {
            e.preventDefault()
            if (locked) return
            if (open) closeMenu(true)
            else openMenu()
          }}
        >
          <ChevronIcon open={open} />
        </button>
      </div>

      {open && !locked ? (
        <div
          className="ui-dropdown-menu"
          role="listbox"
          style={{ maxHeight: menuHeight }}
        >
          {showClearRow ? (
            <button
              type="button"
              className="ui-dropdown-clear-row"
              onClick={clearSelection}
            >
              {t('Please_select', 'Please select')}
            </button>
          ) : null}
          <div className="ui-dropdown-menu-list">
            {filtered.length === 0 ? (
              <div className="ui-dropdown-empty">{t('No_Records_Found', 'No Records Found')}</div>
            ) : (
              filtered.map((item) => {
                const isSelected = String(item.value) === String(value)
                return (
                  <button
                    key={String(item.value)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={!item.enabled}
                    className={[
                      'ui-dropdown-item',
                      isSelected ? 'is-selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => pick(item)}
                  >
                    {item.label}
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}

      {error ? (
        <UIText as="span" variant="b12Regular" className="ui-dropdown-error">
          {error}
        </UIText>
      ) : null}
    </div>
  )
}

export default UIDropdown
