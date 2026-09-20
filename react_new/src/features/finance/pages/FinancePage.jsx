import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  salaryAdvanceService,
  salaryAdvanceFeeService,
} from '../services/financeService'
import './FinancePage.css'

const TABS = [
  {
    key: 'advance',
    label: 'Salary Advance Finance Configuration',
    addLabel: 'Add Salary Advanced',
    service: salaryAdvanceService,
    tone: {
      backgroundColor: '#F1F6FF',
      numberColor: '#2563EB',
      iconColor: '#2563EB',
      borderColor: '#D6E7FF',
    },
    columns: [
      { key: 'segment', label: 'Segment' },
      { key: 'productId', label: 'Product Id' },
      { key: 'instrumentId', label: 'Instrument' },
      { key: 'term', label: 'Term' },
      { key: 'profitRate', label: 'Profit Rate' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'segment', label: 'Segment', required: true },
      { key: 'productId', label: 'Product Id', required: true },
      { key: 'operatorId', label: 'Operator Id' },
      { key: 'instrumentId', label: 'Instrument Id' },
      { key: 'paymentId', label: 'Payment Method Id' },
      { key: 'collectionMethodId', label: 'Collection Method Id' },
      { key: 'term', label: 'Term' },
      { key: 'period', label: 'Period', defaultValue: 'Month(s)' },
      { key: 'installment', label: 'Installment' },
      { key: 'profitRateType', label: 'Profit Rate Type' },
      { key: 'profitRate', label: 'Profit Rate' },
      { key: 'moveNext', label: 'Move Next', defaultValue: 'Yes' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'fee',
    label: 'Salary Advance Finance Fee Configuration',
    addLabel: 'Add Configuration',
    service: salaryAdvanceFeeService,
    tone: {
      backgroundColor: '#FFF7EF',
      numberColor: '#EA8A2B',
      iconColor: '#EA8A2B',
      borderColor: '#FFEFD9',
    },
    columns: [
      { key: 'fee', label: 'Fee' },
      { key: 'min', label: 'Min Amount' },
      { key: 'max', label: 'Max Amount' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'fee', label: 'Fee', required: true },
      { key: 'min', label: 'Min Amount', required: true },
      { key: 'max', label: 'Max Amount', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
]

/** Flutter SalaryAdvancePage */
export default function FinancePage() {
  const [tab, setTab] = useState('advance')
  const [counts, setCounts] = useState({ advance: 0, fee: 0 })
  const actionsRef = useRef(null)
  const active = TABS.find((x) => x.key === tab) || TABS[0]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.allSettled(TABS.map((x) => x.service.fetchAll()))
      if (cancelled) return
      setCounts((prev) => {
        const next = { ...prev }
        results.forEach((res, i) => {
          next[TABS[i].key] = res.status === 'fulfilled' ? (res.value?.data || []).length : 0
        })
        return next
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

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
    <Box className="salary-advance-page">
      <Box className="salary-advance-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Salary_Advance', 'Salary Advance')}
        </UIText>
        <UIAddButton
          label={t(active.addLabel, active.addLabel)}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>
      <UIMetricCardRow cards={metricCards} />
      <Box className="salary-advance-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={['salary-advance-tab', tab === item.key ? 'is-selected' : '']
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
        onRowsChange={(rows) =>
          setCounts((prev) => ({
            ...prev,
            [active.key]: Array.isArray(rows) ? rows.length : 0,
          }))
        }
        title={active.label}
        entityLabel={active.label}
        addLabel={active.addLabel}
        listTitle={active.label}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
