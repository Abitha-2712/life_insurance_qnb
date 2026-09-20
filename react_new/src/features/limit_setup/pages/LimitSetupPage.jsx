import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/limit_setupService'
import './LimitSetupPage.css'

const TABS = [
  {
    key: 'customer',
    label: 'Customers',
    addLabel: 'Add',
    tone: { backgroundColor: '#F1F6FF', numberColor: '#2563EB', iconColor: '#2563EB', borderColor: '#D6E7FF' },
  },
  {
    key: 'class',
    label: 'Customer Class',
    addLabel: 'Add Class Limit',
    tone: { backgroundColor: '#FFFFFF', numberColor: '#485363', iconColor: '#94A3B8', borderColor: '#E5E7EB' },
  },
  {
    key: 'segment',
    label: 'Segment Based',
    addLabel: 'Add Segment Limit',
    tone: { backgroundColor: '#F1F6FF', numberColor: '#2563EB', iconColor: '#2563EB', borderColor: '#D6E7FF' },
    hideAdd: true,
  },
  {
    key: 'default',
    label: 'Default Limit',
    addLabel: 'Add Limit',
    tone: { backgroundColor: '#FFF7EF', numberColor: '#EA8A2B', iconColor: '#EA8A2B', borderColor: '#FFEFD9' },
  },
]

const columns = [
  { key: 'limitCode', label: 'Code' },
  { key: 'limitName', label: 'Name' },
  { key: 'transferType', label: 'Type' },
  { key: 'channel', label: 'Channel' },
  { key: 'perTxnLimit', label: 'Per Txn' },
  { key: 'dailyLimit', label: 'Daily' },
  { key: 'limitCategory', label: 'Category' },
  { key: 'status', label: 'Status', statusChip: true },
]

/** Flutter TransferLimitPage */
export default function LimitSetupPage() {
  const [tab, setTab] = useState('customer')
  const [counts, setCounts] = useState({ customer: 0, class: 0, segment: 0, default: 0 })
  const actionsRef = useRef(null)
  const active = TABS.find((x) => x.key === tab) || TABS[0]

  const fields = useMemo(
    () => [
      { key: 'limitCode', label: 'Limit Code', required: true, lockOnEdit: true },
      { key: 'limitName', label: 'Limit Name', required: true },
      {
        key: 'limitCategory',
        label: 'Limit Category',
        type: 'select',
        required: true,
        defaultValue: tab,
        options: [
          { value: 'customer', label: 'Customers' },
          { value: 'class', label: 'Customer Class' },
          { value: 'segment', label: 'Segment Based' },
          { value: 'default', label: 'Default Limit' },
        ],
      },
      {
        key: 'transferType',
        label: 'Transfer Type',
        type: 'select',
        required: true,
        options: [
          { value: 'DOMESTIC', label: 'Domestic' },
          { value: 'INTERNATIONAL', label: 'International' },
          { value: 'OWN', label: 'Own Account' },
          { value: 'WITHIN_BANK', label: 'Within Bank' },
          { value: 'OTHER', label: 'Other' },
        ],
        defaultValue: 'DOMESTIC',
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        options: [
          { value: 'IB', label: 'Internet Banking' },
          { value: 'MB', label: 'Mobile Banking' },
          { value: 'ALL', label: 'All' },
        ],
        defaultValue: 'ALL',
      },
      { key: 'segmentCode', label: 'Segment Code' },
      { key: 'perTxnLimit', label: 'Per Transaction Limit', required: true },
      { key: 'dailyLimit', label: 'Daily Limit' },
      { key: 'monthlyLimit', label: 'Monthly Limit' },
      { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    [tab],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await service.fetchAll().catch(() => ({ data: [] }))
      if (cancelled) return
      const rows = res?.data || []
      const next = { customer: 0, class: 0, segment: 0, default: 0 }
      rows.forEach((r) => {
        const cat = r.limitCategory || 'customer'
        if (next[cat] != null) next[cat] += 1
        else next.customer += 1
      })
      setCounts(next)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const rowFilter = useCallback(
    (rows) => (Array.isArray(rows) ? rows.filter((r) => (r.limitCategory || 'customer') === tab) : []),
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
    <Box className="transfer-limit-page">
      <Box className="transfer-limit-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Transfer_Limit_Configuration', 'Transfer Limit Configuration')}
        </UIText>
        {!active.hideAdd ? (
          <UIAddButton
            label={t(active.addLabel, active.addLabel)}
            onClick={() => actionsRef.current?.openAdd?.()}
          />
        ) : null}
      </Box>
      <UIMetricCardRow cards={metricCards} />
      <Box className="transfer-limit-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={['transfer-limit-tab', tab === item.key ? 'is-selected' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setTab(item.key)}
          >
            {t(item.label, item.label)}
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
            ? rows.filter((r) => (r.limitCategory || 'customer') === tab)
            : []
          setCounts((prev) => ({ ...prev, [tab]: filtered.length }))
        }}
        title={active.label}
        entityLabel={active.label}
        addLabel={active.addLabel}
        listTitle={active.label}
        service={service}
        columns={columns}
        fields={fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
