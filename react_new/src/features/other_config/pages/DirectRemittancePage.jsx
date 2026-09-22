import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import remittanceTypeService from '../services/direct_remittance_typeService'
import purposeService from '../services/rtp_purposeService'
import beneficiaryService from '../services/direct_remittanceService'
import './DirectRemittancePage.css'

const TABS = [
  {
    key: 'type',
    label: 'Direct Remittance Management',
    addLabel: 'Add Remittance Type',
    service: remittanceTypeService,
    tone: { backgroundColor: '#F1F6FF', numberColor: '#2563EB', iconColor: '#2563EB', borderColor: '#D6E7FF' },
    columns: [
      { key: 'typeCode', label: 'Type Code' },
      { key: 'typeName', label: 'Type Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'typeCode', label: 'Type Code', required: true, lockOnEdit: true },
      { key: 'typeName', label: 'Type Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'purpose',
    label: 'Purpose Code',
    addLabel: 'Add Purpose Code',
    service: purposeService,
    tone: { backgroundColor: '#FFFFFF', numberColor: '#485363', iconColor: '#94A3B8', borderColor: '#E5E7EB' },
    columns: [
      { key: 'purposeCode', label: 'Purpose Code' },
      { key: 'purposeName', label: 'Purpose Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'purposeCode', label: 'Purpose Code', required: true, lockOnEdit: true },
      { key: 'purposeName', label: 'Purpose Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'beneficiary',
    label: 'Beneficiary Account Type',
    addLabel: 'Add Beneficiary Account Type',
    service: beneficiaryService,
    tone: { backgroundColor: '#FFF7EF', numberColor: '#EA8A2B', iconColor: '#EA8A2B', borderColor: '#FFEFD9' },
    columns: [
      { key: 'beneficiaryAccountTypeCode', label: 'Code' },
      { key: 'beneficiaryAccountTypeName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'beneficiaryAccountTypeCode', label: 'Code', required: true, lockOnEdit: true },
      { key: 'beneficiaryAccountTypeName', label: 'Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
]

export default function DirectRemittancePage() {
  const [tab, setTab] = useState('type')
  const [counts, setCounts] = useState({ type: 0, purpose: 0, beneficiary: 0 })
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
    return () => { cancelled = true }
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
    <Box className="direct-remittance-page">
      <Box className="direct-remittance-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Direct_Remittance', 'Direct Remittance')}
        </UIText>
        <UIAddButton label={t(active.addLabel, active.addLabel)} onClick={() => actionsRef.current?.openAdd?.()} />
      </Box>
      <UIMetricCardRow cards={metricCards} />
      <Box className="direct-remittance-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={['direct-remittance-tab', tab === item.key ? 'is-selected' : ''].filter(Boolean).join(' ')}
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
          setCounts((prev) => ({ ...prev, [active.key]: Array.isArray(rows) ? rows.length : 0 }))
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
