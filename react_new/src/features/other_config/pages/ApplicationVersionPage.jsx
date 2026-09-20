import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '@/features/force_update_configuration/services/force_update_configurationService'
import './ApplicationVersionPage.css'

const TABS = [
  {
    key: 'Android',
    label: 'Total ANDROID Versions',
    tabLabel: 'Android',
    addLabel: 'Add Android Application Version',
    tone: { backgroundColor: '#F1F6FF', numberColor: '#2563EB', iconColor: '#2563EB', borderColor: '#D6E7FF' },
  },
  {
    key: 'iOS',
    label: 'Total IOS Versions',
    tabLabel: 'iOS',
    addLabel: 'Add IOS Application Version',
    tone: { backgroundColor: '#FFF7EF', numberColor: '#EA8A2B', iconColor: '#EA8A2B', borderColor: '#FFEFD9' },
  },
]

const columns = [
  { key: 'platform', label: 'Platform' },
  { key: 'version', label: 'Version' },
  { key: 'latestVersion', label: 'Latest' },
  { key: 'status', label: 'Status', statusChip: true },
]

/** Flutter ApplicationVersionTablePage — Android / iOS metric hub */
export default function ApplicationVersionPage() {
  const [tab, setTab] = useState('Android')
  const [counts, setCounts] = useState({ Android: 0, iOS: 0 })
  const actionsRef = useRef(null)
  const active = TABS.find((x) => x.key === tab) || TABS[0]

  const fields = useMemo(
    () => [
      {
        key: 'platform',
        label: 'Platform',
        required: true,
        lockOnEdit: true,
        type: 'select',
        defaultValue: tab,
        options: [
          { value: 'Android', label: 'Android' },
          { value: 'iOS', label: 'iOS' },
        ],
      },
      { key: 'version', label: 'Version Number', required: true },
      { key: 'latestVersion', label: 'Latest Version' },
      { key: 'storeUrl', label: 'Store URL' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    [tab],
  )

  const normalizePlatform = (value) => {
    const v = String(value || '').toLowerCase()
    if (v.includes('ios') || v === 'iphone') return 'iOS'
    return 'Android'
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await service.fetchAll().catch(() => ({ data: [] }))
      if (cancelled) return
      const rows = res?.data || []
      const next = { Android: 0, iOS: 0 }
      rows.forEach((r) => {
        const p = normalizePlatform(r.platform)
        next[p] = (next[p] || 0) + 1
      })
      setCounts(next)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const rowFilter = useCallback(
    (rows) =>
      Array.isArray(rows)
        ? rows.filter((r) => normalizePlatform(r.platform) === tab)
        : [],
    [tab],
  )

  const metricCards = useMemo(
    () =>
      TABS.map((item) => ({
        key: item.key,
        title: t(item.label, item.label),
        subtitle: String(counts[item.key] ?? 0),
        selected: tab === item.key,
        onClick: () => setTab(item.key),
        ...item.tone,
      })),
    [counts, tab],
  )

  return (
    <Box className="app-version-page">
      <Box className="app-version-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Application_Version_Management', 'Application Version Management')}
        </UIText>
        <UIAddButton
          label={t(active.addLabel, active.addLabel)}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>
      <UIMetricCardRow cards={metricCards} />
      <Box className="app-version-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={['app-version-tab', tab === item.key ? 'is-selected' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setTab(item.key)}
          >
            {t(item.tabLabel, item.tabLabel)}
          </button>
        ))}
      </Box>
      <GenericCrudPage
        key={active.key}
        embedded
        hideAdd
        hideHeader
        actionsRef={actionsRef}
        rowFilter={rowFilter}
        onRowsChange={(rows) => {
          const filtered = Array.isArray(rows)
            ? rows.filter((r) => normalizePlatform(r.platform) === tab)
            : []
          setCounts((prev) => ({ ...prev, [tab]: filtered.length }))
        }}
        title={active.tabLabel}
        entityLabel={active.tabLabel}
        addLabel={active.addLabel}
        listTitle={active.tabLabel}
        service={service}
        columns={columns}
        fields={fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
