import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIText } from '@/components/ui'
import { t } from '@/core/i18n/t'

const TARGET_RATE = 97
const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Flutter hour label e.g. `"08 Jun 17:00 - 18:00"`. */
export function mapHourlySeriesToCells(hourlySeries = [], year = new Date().getFullYear()) {
  const re = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{1,2}):(\d{2})/
  const cells = []
  for (const point of hourlySeries) {
    const match = re.exec(String(point.hour || '').trim())
    if (!match) continue
    const day = Number(match[1])
    const month = MONTHS[String(match[2]).toLowerCase()]
    const hour = Math.min(23, Math.max(0, Number(match[3])))
    if (!month || !day) continue
    cells.push({
      dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      dateLabel: `${String(day).padStart(2, '0')} ${match[2]}`,
      year,
      month,
      day,
      hour,
      attempts: Number(point.attempts ?? 0),
      failed: Number(point.failed ?? 0),
    })
  }
  return cells
}

export function formatAuditDate(raw, { withYear = true } = {}) {
  if (!raw) return '—'
  const dmy = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(String(raw).trim())
  if (dmy) {
    const label = `${dmy[1].padStart(2, '0')} ${MONTH_SHORT[Number(dmy[2]) - 1] || dmy[2]}`
    return withYear ? `${label} ${dmy[3]}` : label
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw))
  if (iso) {
    const label = `${iso[3]} ${MONTH_SHORT[Number(iso[2]) - 1]}`
    return withYear ? `${label} ${iso[1]}` : label
  }
  return String(raw)
}

function cellColor(intensity) {
  const a = { r: 0xef, g: 0xf6, b: 0xff }
  const b = { r: 0x1d, g: 0x4e, b: 0xd8 }
  const tVal = Math.min(1, Math.max(0, intensity))
  const r = Math.round(a.r + (b.r - a.r) * tVal)
  const g = Math.round(a.g + (b.g - a.g) * tVal)
  const bl = Math.round(a.b + (b.b - a.b) * tVal)
  return `rgb(${r}, ${g}, ${bl})`
}

function normalizeDailyPoints(dailySeries = []) {
  return dailySeries.map((p) => ({
    date: p.date || p.label || '',
    success: Number(p.success ?? 0),
    failed: Number(p.failed ?? 0),
    total: Number(p.total ?? Number(p.success ?? 0) + Number(p.failed ?? 0)),
    successRate: Number(p.successRate ?? p.y ?? 0),
  }))
}

/** Flutter LoginAuditDetailTabs trend — VOLUME bars + SUCCESS RATE VS TARGET */
export function LoginAuditTrendView({ dailySeries = [], targetRate = TARGET_RATE }) {
  const points = useMemo(() => normalizeDailyPoints(dailySeries), [dailySeries])
  const [hover, setHover] = useState(null)

  if (!points.length) {
    return (
      <Box className="home-audit-empty">
        <UIText variant="b13Regular">
          {t('No_data_for_selected_range', 'No data for selected range')}
        </UIText>
      </Box>
    )
  }

  const maxVolume = Math.max(...points.map((p) => p.total), 1)
  let minY = targetRate
  let maxY = targetRate
  for (const p of points) {
    minY = Math.min(minY, p.successRate)
    maxY = Math.max(maxY, p.successRate)
  }
  minY = Math.max(0, minY - 5)
  maxY = Math.min(100, Math.max(maxY + 3, targetRate + 2))
  if (maxY - minY < 10) minY = Math.max(0, maxY - 10)

  const w = 420
  const volH = 64
  const chartH = 220
  const leftPad = 36
  const rightPad = 58
  const top = 20
  const bottom = 28
  const chartW = w - leftPad - rightPad
  const plotH = chartH - top - bottom

  const xAt = (i) =>
    points.length === 1
      ? leftPad + chartW / 2
      : leftPad + (chartW * i) / (points.length - 1)
  const yAt = (rate) => {
    const clamped = Math.min(1, Math.max(0, (rate - minY) / (maxY - minY || 1)))
    return top + plotH * (1 - clamped)
  }

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(p.successRate)}`)
    .join(' ')

  const yLabels = Array.from({ length: 5 }, (_, i) => minY + ((maxY - minY) * i) / 4).reverse()
  const targetY = yAt(targetRate)

  let dipIndex = null
  for (let i = 0; i < points.length - 1; i += 1) {
    if (points[i].successRate >= targetRate) continue
    if (dipIndex == null || points[i].successRate < points[dipIndex].successRate) {
      dipIndex = i
    }
  }

  const labelIndexes = (() => {
    const count = points.length
    if (count <= 1) return [0]
    const maxLabels = Math.max(2, Math.floor(chartW / 42))
    if (count <= maxLabels) return Array.from({ length: count }, (_, i) => i)
    const set = new Set([0, count - 1])
    const inner = maxLabels - 2
    for (let i = 1; i <= inner; i += 1) {
      set.add(Math.round((i * (count - 1)) / (inner + 1)))
    }
    return [...set].sort((a, b) => a - b)
  })()

  return (
    <Box className="home-audit-trend">
      <UIText variant="b12Bold" className="home-audit-section-label">
        {t('VOLUME', 'VOLUME')}
      </UIText>
      <svg viewBox={`0 0 ${w} ${volH}`} className="home-audit-volume-svg" role="img">
        <line x1={leftPad} y1={volH - 0.5} x2={leftPad + chartW} y2={volH - 0.5} stroke="#EAECF0" />
        {points.map((p, i) => {
          if (p.total <= 0) return null
          const slot = chartW / points.length
          const barW = Math.min(22, slot * 0.55)
          const h = (p.total / maxVolume) * (volH - 4)
          const cx = xAt(i)
          return (
            <rect
              key={`v-${i}`}
              x={cx - barW / 2}
              y={volH - h}
              width={barW}
              height={h}
              rx="1.5"
              fill={hover === i ? '#98A2B3' : '#D0D5DD'}
            />
          )
        })}
      </svg>

      <hr className="home-audit-divider" />

      <UIText variant="b12Bold" className="home-audit-section-label is-dark">
        {t('SUCCESS_RATE_VS_TARGET', 'SUCCESS RATE VS TARGET')}
      </UIText>

      <Box
        className="home-audit-success-chart-wrap"
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${w} ${chartH}`}
          className="home-audit-success-svg"
          role="img"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * w
            const usable = chartW
            const rel = Math.min(usable, Math.max(0, x - leftPad))
            const idx =
              points.length === 1
                ? 0
                : Math.round((rel / usable) * (points.length - 1))
            setHover(Math.min(points.length - 1, Math.max(0, idx)))
          }}
        >
          <rect
            x={leftPad}
            y={targetY}
            width={chartW}
            height={Math.max(0, top + plotH - targetY)}
            fill="rgba(254, 228, 226, 0.5)"
          />
          {yLabels.map((label) => {
            const y = yAt(label)
            return (
              <g key={label}>
                <line
                  x1={leftPad}
                  x2={leftPad + chartW}
                  y1={y}
                  y2={y}
                  stroke="#EAECF0"
                />
                <text x={leftPad - 6} y={y + 3} textAnchor="end" className="home-audit-axis">
                  {`${Math.round(label)}%`}
                </text>
              </g>
            )
          })}
          <line
            x1={leftPad}
            x2={leftPad + chartW}
            y1={targetY}
            y2={targetY}
            stroke="#98A2B3"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text x={leftPad + chartW + 4} y={targetY + 3} className="home-audit-axis">
            {`Target ≥ ${targetRate.toFixed(0)}%`}
          </text>
          <path
            d={linePath}
            fill="none"
            stroke="#12B76A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle
              key={`d-${i}`}
              cx={xAt(i)}
              cy={yAt(p.successRate)}
              r={hover === i ? 3.2 : 2}
              fill="#D92D20"
            />
          ))}
          {labelIndexes.map((i) => (
            <text
              key={`lx-${i}`}
              x={xAt(i)}
              y={chartH - 4}
              textAnchor="middle"
              className="home-audit-axis"
            >
              {formatAuditDate(points[i].date, { withYear: false })}
            </text>
          ))}
          {dipIndex != null ? (
            <text
              x={xAt(dipIndex)}
              y={Math.max(12, yAt(points[dipIndex].successRate) - 10)}
              textAnchor="middle"
              className="home-audit-dip-label"
            >
              {`${points[dipIndex].successRate.toFixed(1)}% - ${formatAuditDate(points[dipIndex].date, { withYear: false })}`}
            </text>
          ) : null}
          {hover != null ? (
            <line
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={4}
              y2={chartH - bottom}
              stroke="#98A2B3"
              strokeDasharray="4 3"
            />
          ) : null}
        </svg>
        {hover != null && points[hover] ? (
          <Box className="home-audit-trend-tooltip">
            <UIText variant="b13Bold">
              {formatAuditDate(points[hover].date)}
            </UIText>
            <Box className="home-audit-hour-tooltip-row">
              <span>{t('Attempts', 'Attempts')}</span>
              <strong>{points[hover].total}</strong>
            </Box>
            <Box className="home-audit-hour-tooltip-row">
              <span className="home-audit-hour-tooltip-fail">
                <i style={{ background: '#12B76A' }} />
                {t('Success_rate', 'Success rate')}
              </span>
              <strong>{`${points[hover].successRate.toFixed(1)}%`}</strong>
            </Box>
            <Box className="home-audit-hour-tooltip-row">
              <span className="home-audit-hour-tooltip-fail">
                <i />
                {t('Below_target', 'Below target')}
              </span>
              <strong>
                {points[hover].successRate < targetRate
                  ? t('Yes', 'Yes')
                  : t('No', 'No')}
              </strong>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

/** Flutter LoginAuditDetailTabs._buildByHourView */
export function LoginAuditByHourView({ hourlySeries = [], year }) {
  const [tooltip, setTooltip] = useState(null)

  const cells = useMemo(
    () => mapHourlySeriesToCells(hourlySeries, year ?? new Date().getFullYear()),
    [hourlySeries, year],
  )

  const days = useMemo(() => {
    const map = new Map()
    for (const c of cells) {
      if (!map.has(c.dateKey)) {
        map.set(c.dateKey, {
          dateKey: c.dateKey,
          dateLabel: c.dateLabel,
          sort: c.year * 400 + c.month * 32 + c.day,
        })
      }
    }
    return [...map.values()].sort((a, b) => b.sort - a.sort)
  }, [cells])

  const cellLookup = useMemo(() => {
    const map = new Map()
    for (const c of cells) map.set(`${c.dateKey}:${c.hour}`, c)
    return map
  }, [cells])

  const maxAttempts = useMemo(() => {
    let max = 1
    for (const c of cells) if (c.attempts > max) max = c.attempts
    return max
  }, [cells])

  if (!cells.length) {
    return (
      <Box className="home-audit-empty">
        <UIText variant="b13Regular">
          {t('No_data_for_selected_range', 'No data for selected range')}
        </UIText>
      </Box>
    )
  }

  return (
    <Box className="home-audit-hour">
      <Box className="home-audit-hour-scroll">
        <Box className="home-audit-hour-grid" onMouseLeave={() => setTooltip(null)}>
          <Box className="home-audit-hour-head">
            <span className="home-audit-hour-day-label" />
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="home-audit-hour-tick">
                {`${String(i * 3).padStart(2, '0')}:00`}
              </span>
            ))}
          </Box>
          {days.map((day) => (
            <Box key={day.dateKey} className="home-audit-hour-row">
              <span className="home-audit-hour-day-label">{day.dateLabel}</span>
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = cellLookup.get(`${day.dateKey}:${hour}`) || {
                  dateLabel: day.dateLabel,
                  hour,
                  attempts: 0,
                  failed: 0,
                }
                const intensity = cell.attempts / maxAttempts
                return (
                  <button
                    key={hour}
                    type="button"
                    className="home-audit-hour-cell"
                    style={{ background: cellColor(intensity) }}
                    aria-label={`${day.dateLabel} ${String(hour).padStart(2, '0')}:00`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const parent = e.currentTarget.closest('.home-audit-hour-grid')
                      const parentRect = parent?.getBoundingClientRect()
                      setTooltip({
                        ...cell,
                        dateLabel: day.dateLabel,
                        left: parentRect ? rect.left - parentRect.left + rect.width + 8 : 0,
                        top: parentRect ? rect.top - parentRect.top - 8 : 0,
                      })
                    }}
                  >
                    {cell.failed > 0 ? <span className="home-audit-hour-fail-dot" /> : null}
                  </button>
                )
              })}
            </Box>
          ))}
          {tooltip ? (
            <Box
              className="home-audit-hour-tooltip"
              style={{ left: tooltip.left, top: tooltip.top }}
              role="tooltip"
            >
              <UIText variant="b13Bold" className="home-audit-hour-tooltip-title">
                {`${tooltip.dateLabel} · ${String(tooltip.hour).padStart(2, '0')}:00–${String((tooltip.hour + 1) % 24).padStart(2, '0')}:00`}
              </UIText>
              <Box className="home-audit-hour-tooltip-row">
                <span>{t('Attempts', 'Attempts')}</span>
                <strong>{tooltip.attempts}</strong>
              </Box>
              <Box className="home-audit-hour-tooltip-row">
                <span className="home-audit-hour-tooltip-fail">
                  <i />
                  {t('Failed', 'Failed')}
                </span>
                <strong>{tooltip.failed}</strong>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box className="home-audit-hour-legend">
        <span>{t('Lower_volume', 'Lower volume')}</span>
        <span className="home-audit-hour-swatches" aria-hidden="true">
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <i key={v} style={{ background: cellColor(v) }} />
          ))}
        </span>
        <span>{t('Higher_volume', 'Higher volume')}</span>
        <span className="home-audit-hour-fail-legend">
          <i />
          {t('Elevated_failures', 'Elevated failures')}
        </span>
      </Box>
    </Box>
  )
}

/** Flutter LoginAuditDetailTabs._buildTableView */
export function LoginAuditDailyTableView({ dailySeries = [] }) {
  const rows = useMemo(
    () => [...normalizeDailyPoints(dailySeries)].reverse(),
    [dailySeries],
  )

  if (!rows.length) {
    return (
      <Box className="home-audit-empty">
        <UIText variant="b13Regular">
          {t('No_data_for_selected_range', 'No data for selected range')}
        </UIText>
      </Box>
    )
  }

  return (
    <Box className="home-audit-daily-table">
      <Box className="home-audit-daily-head">
        <span className="is-date">{t('DATE', 'DATE')}</span>
        <span>{t('SUCCESS', 'SUCCESS')}</span>
        <span>{t('FAILED', 'FAILED')}</span>
        <span>{t('TOTAL', 'TOTAL')}</span>
      </Box>
      {rows.map((row, i) => (
        <Box key={`${row.date}-${i}`} className="home-audit-daily-row">
          <span className="is-date">{formatAuditDate(row.date)}</span>
          <span>{row.success}</span>
          <span>{row.failed}</span>
          <span>{row.total}</span>
        </Box>
      ))}
    </Box>
  )
}

/** Flutter LoginAuditRecentEntriesTable */
export function LoginAuditRecentEntries({ entries = [], onViewFullLog }) {
  const rows = entries.slice(0, 6)

  return (
    <Box className="home-audit-recent">
      <Box className="home-audit-recent-head">
        <UIText variant="b12Bold" className="home-audit-recent-title">
          {t('RECENT_ENTRIES', 'RECENT ENTRIES')}
        </UIText>
        <button type="button" className="home-view-log-btn" onClick={onViewFullLog}>
          {t('View_full_log', 'View full log')}
        </button>
      </Box>
      {rows.length ? (
        <Box className="home-audit-recent-scroll">
          <Box className="home-audit-recent-table">
            <Box className="home-audit-recent-row is-head">
              <span>{t('TIME', 'TIME')}</span>
              <span>{t('CUSTOMER_ID', 'CUSTOMER ID')}</span>
              <span>{t('CATEGORY', 'CATEGORY')}</span>
              <span>{t('CHANNEL', 'CHANNEL')}</span>
              <span>{t('RESULT', 'RESULT')}</span>
              <span>{t('IP_ADDRESS', 'IP ADDRESS')}</span>
              <span>{t('DEVICE', 'DEVICE')}</span>
            </Box>
            {rows.map((row, i) => (
              <Box key={i} className="home-audit-recent-row">
                <span>{row.requestTime || row.time || '—'}</span>
                <span>{row.username || '—'}</span>
                <span className="is-mono">{row.categoryCode || '—'}</span>
                <span>{row.channelId || '—'}</span>
                <span className={`home-audit-result ${row.isSuccess ? 'is-ok' : 'is-fail'}`}>
                  <span className="home-audit-result-dot" aria-hidden="true" />
                  {row.isSuccess ? t('Success', 'Success') : t('Failed', 'Failed')}
                </span>
                <span>{row.ipAddress || '—'}</span>
                <span>{row.devices || '—'}</span>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <UIText variant="b13Regular" className="home-audit-recent-empty">
          {t('No_recent_entries', 'No recent entries for selected range')}
        </UIText>
      )}
    </Box>
  )
}

export function LoginAuditSparkline({ values = [] }) {
  if (!values.length) {
    return <svg className="home-audit-sparkline" viewBox="0 0 120 64" aria-hidden="true" />
  }
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const range = Math.abs(maxV - minV) < 0.001 ? 1 : maxV - minV
  const w = 120
  const h = 64
  const path = values
    .map((v, i) => {
      const x = values.length === 1 ? 0 : (w * i) / (values.length - 1)
      const normalized = (v - minV) / range
      const y = h - normalized * h * 0.85 - 4
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
  const baseline = h * 0.55

  return (
    <svg className="home-audit-sparkline" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <line
        x1="0"
        y1={baseline}
        x2={w}
        y2={baseline}
        stroke="#D0D5DD"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <path d={path} fill="none" stroke="#12B76A" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default {
  LoginAuditTrendView,
  LoginAuditByHourView,
  LoginAuditDailyTableView,
  LoginAuditRecentEntries,
  LoginAuditSparkline,
}
