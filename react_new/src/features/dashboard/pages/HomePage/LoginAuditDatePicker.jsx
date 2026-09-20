import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@/core/i18n/t'

/** Flutter `_LoginAuditDatePreset` */
export const LOGIN_AUDIT_PRESETS = [
  { id: 'last7Days', label: 'Last 7 days', days: 7 },
  { id: 'last30Days', label: 'Last 30 days', days: 30 },
  { id: 'last90Days', label: 'Last 90 days', days: 90 },
  { id: 'monthToDate', label: 'Month to date' },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Flutter DateFormat('dd-MM-yyyy') */
export function formatLoginAuditDate(d) {
  const date = d instanceof Date ? d : new Date(d)
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`
}

export function parseLoginAuditDate(str) {
  const m = String(str || '').trim().match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  const d = new Date(year, month - 1, day)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null
  return d
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function toIsoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fromIsoDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function rangeForPreset(presetId, customStart, customEnd) {
  const end = startOfDay(new Date())
  switch (presetId) {
    case 'last30Days':
      return {
        from: new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29),
        to: end,
      }
    case 'last90Days':
      return {
        from: new Date(end.getFullYear(), end.getMonth(), end.getDate() - 89),
        to: end,
      }
    case 'monthToDate':
      return {
        from: new Date(end.getFullYear(), end.getMonth(), 1),
        to: end,
      }
    case 'custom': {
      const from = customStart ? startOfDay(customStart) : new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)
      const to = customEnd ? startOfDay(customEnd) : end
      return { from, to }
    }
    case 'last7Days':
    default:
      return {
        from: new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6),
        to: end,
      }
  }
}

export function inclusiveDayCount(fromDate, toDate) {
  const from = fromDate instanceof Date ? fromDate : parseLoginAuditDate(fromDate)
  const to = toDate instanceof Date ? toDate : parseLoginAuditDate(toDate)
  if (!from || !to) return 7
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime()
  return Math.max(1, Math.round(ms / 86400000) + 1)
}

export function buildLoginAuditRange(presetId = 'last7Days', customStart, customEnd) {
  const { from, to } = rangeForPreset(presetId, customStart, customEnd)
  return {
    presetId,
    fromDate: formatLoginAuditDate(from),
    toDate: formatLoginAuditDate(to),
    year: to.getFullYear(),
    periodDays: inclusiveDayCount(from, to),
  }
}

function CalendarIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2v3M16 2v3M3.5 9h17M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronIcon({ up = false, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transform: up ? 'rotate(180deg)' : undefined }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Flutter Row7 login-audit date menu — one picker drives FO + BO.
 */
export default function LoginAuditDatePicker({ value, onChange }) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [customExpanded, setCustomExpanded] = useState(true)
  const applied = value || buildLoginAuditRange('last7Days')
  const defaultCustom = rangeForPreset('last7Days')
  const [draftStart, setDraftStart] = useState(
    parseLoginAuditDate(applied.fromDate) || defaultCustom.from,
  )
  const [draftEnd, setDraftEnd] = useState(parseLoginAuditDate(applied.toDate) || defaultCustom.to)

  useEffect(() => {
    if (!open) return
    setDraftStart(parseLoginAuditDate(applied.fromDate) || defaultCustom.from)
    setDraftEnd(parseLoginAuditDate(applied.toDate) || defaultCustom.to)
  }, [open, applied.fromDate, applied.toDate])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const triggerLabel = useMemo(() => {
    if (applied.presetId === 'custom') {
      return `${applied.fromDate} - ${applied.toDate}`
    }
    const preset = LOGIN_AUDIT_PRESETS.find((p) => p.id === applied.presetId)
    return preset?.label || 'Last 7 days'
  }, [applied])

  const applyPreset = (presetId) => {
    if (presetId === 'monthToDate') {
      const range = buildLoginAuditRange('monthToDate')
      onChange?.(range)
      setOpen(false)
      return
    }
    onChange?.(buildLoginAuditRange(presetId))
    setOpen(false)
  }

  const applyCustom = () => {
    if (!draftStart || !draftEnd) return
    if (startOfDay(draftEnd).getTime() < startOfDay(draftStart).getTime()) return
    onChange?.(buildLoginAuditRange('custom', draftStart, draftEnd))
    setOpen(false)
  }

  return (
    <div className="home-audit-date-picker" ref={rootRef}>
      <button
        type="button"
        className={`home-period-btn home-audit-date-trigger${open ? ' is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarIcon />
        <span>{triggerLabel}</span>
        <ChevronIcon up={open} />
      </button>

      {open ? (
        <div className="home-audit-date-menu" role="dialog" aria-label={t('Date_range', 'Date range')}>
          <div className="home-audit-date-presets">
            {LOGIN_AUDIT_PRESETS.map((preset) => {
              const selected = applied.presetId === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`home-audit-date-preset${selected ? ' is-selected' : ''}`}
                  onClick={() => applyPreset(preset.id)}
                >
                  <span>{t(preset.id, preset.label)}</span>
                  {selected ? <CheckIcon /> : null}
                </button>
              )
            })}
          </div>

          <div className="home-audit-date-divider" />

          <button
            type="button"
            className="home-audit-date-custom-toggle"
            onClick={() => setCustomExpanded((v) => !v)}
          >
            <span>{t('Custom_range', 'Custom range')}</span>
            <ChevronIcon up={customExpanded} />
          </button>

          {customExpanded ? (
            <div className="home-audit-date-custom-body">
              <div className="home-audit-date-fields">
                <label className="home-audit-date-field">
                  <input
                    type="date"
                    value={toIsoDate(draftStart)}
                    max={toIsoDate(draftEnd)}
                    onChange={(e) => {
                      const next = fromIsoDate(e.target.value)
                      if (next) setDraftStart(next)
                    }}
                  />
                  <span className="home-audit-date-field-display">{formatLoginAuditDate(draftStart)}</span>
                  <CalendarIcon size={15} />
                </label>
                <label className="home-audit-date-field">
                  <input
                    type="date"
                    value={toIsoDate(draftEnd)}
                    min={toIsoDate(draftStart)}
                    max={toIsoDate(startOfDay(new Date()))}
                    onChange={(e) => {
                      const next = fromIsoDate(e.target.value)
                      if (next) setDraftEnd(next)
                    }}
                  />
                  <span className="home-audit-date-field-display">{formatLoginAuditDate(draftEnd)}</span>
                  <CalendarIcon size={15} />
                </label>
              </div>
              <button type="button" className="home-audit-date-apply" onClick={applyCustom}>
                {t('Apply', 'Apply')}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
