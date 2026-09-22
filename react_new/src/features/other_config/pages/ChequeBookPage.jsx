import { useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  chequeBookReasonService,
  chequeBookConfigService,
} from '../services/cheque_bookService'
import './ChequeBookPage.css'

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3.5 8.5L12 13l8.5-4.5M12 13v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l9 5-9 5-9-5 9-5zm0 9l9 5-9 5-9-5 9-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const TABS = [
  {
    key: 'reason',
    label: 'Cheque Book Reason',
    labelKey: 'Cheque_Book_Reason',
    service: chequeBookReasonService,
    addLabel: 'Add Cheque Book Reason',
    addLabelKey: 'Add_Cheque_Book_Reason',
    listTitle: 'List of Cheque Book Reasons',
    entityLabel: 'Cheque Book Reason',
    showAdd: true,
    columns: [
      { key: 'englishReason', label: 'English Reason' },
      { key: 'arabicReason', label: 'Arabic Reason' },
      { key: 'orderId', label: 'Order' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'englishReason', label: 'English Reason', required: true },
      { key: 'arabicReason', label: 'Arabic Reason' },
      { key: 'orderId', label: 'Order Id' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'config',
    label: 'Cheque Book Configuration',
    labelKey: 'Cheque_Book_Configuration',
    service: chequeBookConfigService,
    addLabel: 'Add Cheque Book Configuration',
    listTitle: 'List of Cheque Book Configuration',
    entityLabel: 'Cheque Book Configuration',
    showAdd: false,
    columns: [
      { key: 'segmentName', label: 'Segment' },
      { key: 'chequeLeaveNumbers', label: 'Leaves' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'segmentName', label: 'Segment', required: true },
      { key: 'chequeLeaveNumbers', label: 'Cheque Leave Numbers' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
]

/**
 * Flutter ChequeBookTablePage — metrics + Reason / Configuration tabs.
 */
export default function ChequeBookPage() {
  const [tab, setTab] = useState('reason')
  const [counts, setCounts] = useState({ reason: 0, config: 0 })
  const actionsRef = useRef(null)
  const active = TABS.find((t) => t.key === tab) || TABS[0]

  const metricCards = useMemo(
    () => [
      {
        key: 'reason',
        title: t('Total_Cheque_Book_Reason', 'Total Cheque Book Reason'),
        subtitle: String(counts.reason),
        icon: <PackageIcon />,
        backgroundColor: '#F1F6FF',
        numberColor: '#2563EB',
        iconColor: '#2563EB',
        borderColor: '#D6E7FF',
      },
      {
        key: 'config',
        title: t(
          'Total_Active_Cheque_Book_Configuration',
          'Total Active Cheque Book Configuration',
        ),
        subtitle: String(counts.config),
        icon: <LayersIcon />,
        backgroundColor: '#FFFFFF',
        numberColor: '#485363',
        iconColor: '#94A3B8',
        borderColor: '#E5E7EB',
      },
    ],
    [counts],
  )

  return (
    <Box className="cheque-book-page">
      <Box className="cheque-book-header">
        <UIText as="h2" variant="h24SemiBold" className="cheque-book-title">
          {t('Cheque_Book_Management', 'Cheque Book Management')}
        </UIText>
        {active.showAdd ? (
          <UIAddButton
            label={t(active.addLabelKey || active.addLabel, active.addLabel)}
            onClick={() => actionsRef.current?.openAdd?.()}
          />
        ) : null}
      </Box>

      <UIMetricCardRow cards={metricCards} />

      <Box className="cheque-book-tabs" role="tablist">
        {TABS.map((item) => {
          const selected = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['cheque-book-tab', selected ? 'is-selected' : '']
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
        entityLabel={active.entityLabel}
        addLabel={t(active.addLabelKey || active.addLabel, active.addLabel)}
        listTitle={t(active.listTitle, active.listTitle)}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
