import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  financeOfferService,
  financeConfigurationService,
} from '../services/finance_offerService'
import './FinanceOfferPage.css'

function OfferIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5zm0 9l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function ConfigIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const offerColumns = [
  { key: 'segment', label: 'Segment' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'product', label: 'Product' },
  { key: 'term', label: 'Term' },
  { key: 'currency', label: 'Currency' },
  { key: 'minAmount', label: 'Min' },
  { key: 'maxAmount', label: 'Max' },
]
const offerFields = [
  { key: 'segment', label: 'Segment', required: true },
  { key: 'instrument', label: 'Instrument' },
  { key: 'product', label: 'Product' },
  { key: 'term', label: 'Term' },
  { key: 'period', label: 'Period' },
  { key: 'currency', label: 'Currency' },
  { key: 'minAmount', label: 'Min Amount' },
  { key: 'maxAmount', label: 'Max Amount' },
]

const TABS = [
  {
    key: 'offer',
    label: 'Finance Offer',
    labelKey: 'Finance_Offer',
    addLabel: 'Add Finance Offer',
    addLabelKey: 'Add_Finance_Offer',
    service: financeOfferService,
    Icon: OfferIcon,
    tone: {
      backgroundColor: '#F1F6FF',
      numberColor: '#2563EB',
      iconColor: '#2563EB',
      borderColor: '#D6E7FF',
    },
    columns: offerColumns,
    fields: offerFields,
  },
  {
    key: 'config',
    label: 'Finance Configuration',
    labelKey: 'Finance_Configuration',
    addLabel: 'Add Finance Configuration',
    addLabelKey: 'Add_Finance_Configuration',
    service: financeConfigurationService,
    Icon: ConfigIcon,
    tone: {
      backgroundColor: '#FFF7EF',
      numberColor: '#EA8A2B',
      iconColor: '#EA8A2B',
      borderColor: '#FFEFD9',
    },
    columns: offerColumns,
    fields: offerFields,
  },
]

/** Flutter FinanceOfferTablePage */
export default function FinanceOfferPage() {
  const [tab, setTab] = useState('offer')
  const [counts, setCounts] = useState({ offer: 0, config: 0 })
  const actionsRef = useRef(null)
  const active = TABS.find((item) => item.key === tab) || TABS[0]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.allSettled(TABS.map((item) => item.service.fetchAll()))
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
      TABS.map((item) => {
        const Icon = item.Icon
        return {
          key: item.key,
          title: t(item.labelKey, item.label),
          subtitle: String(counts[item.key] ?? 0),
          icon: <Icon />,
          selected: tab === item.key,
          onClick: () => setTab(item.key),
          ...item.tone,
        }
      }),
    [counts, tab],
  )

  return (
    <Box className="finance-offer-page">
      <Box className="finance-offer-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Finance_Offer', 'Finance Offer')}
        </UIText>
        <UIAddButton
          label={t(active.addLabelKey, active.addLabel)}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>

      <UIMetricCardRow cards={metricCards} />

      <Box className="finance-offer-tabs" role="tablist">
        {TABS.map((item) => {
          const selected = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['finance-offer-tab', selected ? 'is-selected' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setTab(item.key)}
            >
              {t(item.labelKey, item.label)}
            </button>
          )
        })}
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
        addLabel={t(active.addLabelKey, active.addLabel)}
        listTitle={active.label}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
