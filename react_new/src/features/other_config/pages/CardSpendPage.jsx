import { useCallback, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/card_spendService'
import './CardSpendPage.css'

function isActiveStatus(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CancelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'code', label: 'Code' },
  { key: 'cardSpendImageName', label: 'Card Spend Image Name' },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'status', label: 'Status', statusChip: true },
  { key: 'cardSpendImage', label: 'Card Spend Image', image: true },
]

const fields = [
  { key: 'id', label: 'Id', required: true, lockOnEdit: true },
  { key: 'code', label: 'Code' },
  { key: 'cardSpendImageName', label: 'Card Spend Image Name' },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'cardSpendImage', label: 'Card Spend Image', image: true },
]

/**
 * Flutter CardSpendTablePage — title "Sector Management", metric cards, Add Sector.
 */
export default function CardSpendPage() {
  const actionsRef = useRef(null)
  const [rows, setRows] = useState([])
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const counts = useMemo(() => {
    const active = rows.filter((r) => isActiveStatus(r.status)).length
    return {
      total: rows.length,
      active,
      inactive: rows.length - active,
    }
  }, [rows])

  const rowFilter = useCallback(
    (list) => {
      if (!showOnlyActive) return list
      return list.filter((r) => isActiveStatus(r.status))
    },
    [showOnlyActive],
  )

  const metricCards = useMemo(
    () => [
      {
        key: 'total',
        title: t('Total_Sector', 'Total Sector'),
        subtitle: String(counts.total),
        icon: <LayersIcon />,
        backgroundColor: '#F1F6FF',
        numberColor: '#2563EB',
        iconColor: '#2563EB',
        borderColor: '#D6E7FF',
      },
      {
        key: 'active',
        title: t('Active_Sector', 'Active Sector'),
        subtitle: String(counts.active),
        icon: <CheckIcon />,
        backgroundColor: '#EFFCF6',
        numberColor: '#059669',
        iconColor: '#059669',
        borderColor: '#D1FAE5',
        selected: showOnlyActive,
        onClick: () => setShowOnlyActive((v) => !v),
      },
      {
        key: 'inactive',
        title: t('Inactive_Sector', 'Inactive Sector'),
        subtitle: String(counts.inactive),
        icon: <CancelIcon />,
        backgroundColor: '#FFF7EF',
        numberColor: '#EA8A2B',
        iconColor: '#EA8A2B',
        borderColor: '#FFEFD9',
      },
    ],
    [counts, showOnlyActive],
  )

  return (
    <Box className="card-spend-page">
      <Box className="card-spend-header">
        <UIText as="h2" variant="h24SemiBold" className="card-spend-title">
          {t('Sector_Management', 'Sector Management')}
        </UIText>
        <UIAddButton
          label={t('Add_Sector', 'Add Sector')}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>

      <UIMetricCardRow cards={metricCards} />

      <GenericCrudPage
        embedded
        hideAdd
        hideHeader
        actionsRef={actionsRef}
        rowFilter={rowFilter}
        onRowsChange={setRows}
        title="Sector"
        entityLabel="Sector"
        addLabel={t('Add_Sector', 'Add Sector')}
        listTitle={t('List_of_Sectors', 'List of Sectors')}
        service={service}
        columns={columns}
        fields={fields}
        enableStatusFilter={false}
        pdfFileName="card_spend.pdf"
        excelFileName="card_spend.xlsx"
      />
    </Box>
  )
}
