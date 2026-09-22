import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  preApprovedInstantCreditService,
  salaryMatrixService,
  prepaidCardService,
} from '../services/card_issuanceService'
import './CardIssuancePage.css'

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M3 14h18M9 9v11M15 9v11" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function MembershipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 10h6M12 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  {
    key: 'preapproved',
    label: 'PreApproved Instant Credit Card',
    labelKey: 'Card_Issuance_Tab_PreApproved_Instant_Credit_Card',
    service: preApprovedInstantCreditService,
    Icon: CreditCardIcon,
    tone: {
      backgroundColor: '#F1F6FF',
      numberColor: '#2563EB',
      iconColor: '#2563EB',
      borderColor: '#D6E7FF',
    },
    columns: [
      { key: 'rimNumber', label: 'RIM Number' },
      { key: 'salaryAccount', label: 'Salary Account' },
      { key: 'salaryAccountType', label: 'Salary Account Type' },
      { key: 'salaryQar', label: 'Salary[QAR]' },
      { key: 'seenStatus', label: 'Seen Status' },
      { key: 'appliedToOffer', label: 'Applied to the Offer' },
    ],
    fields: [
      { key: 'rimNumber', label: 'RIM Number', required: true },
      { key: 'salaryAccount', label: 'Salary Account' },
      { key: 'salaryAccountType', label: 'Salary Account Type' },
      { key: 'salaryQar', label: 'Salary [QAR]' },
      { key: 'priority', label: 'Priority' },
    ],
  },
  {
    key: 'salary',
    label: 'Salary Matrix',
    labelKey: 'Card_Issuance_Tab_Salary_Matrix',
    service: salaryMatrixService,
    Icon: TableIcon,
    tone: {
      backgroundColor: '#FFFFFF',
      numberColor: '#485363',
      iconColor: '#94A3B8',
      borderColor: '#E5E7EB',
    },
    columns: [
      { key: 'cardType', label: 'Card Type' },
      { key: 'issuer', label: 'Issuer' },
      { key: 'minSalary', label: 'Min Salary [QAR]' },
      { key: 'maxSalary', label: 'Max Salary [QAR]' },
      { key: 'cardProduct', label: 'Card Product Code' },
      { key: 'regularProfileCode', label: 'Regular Profile Code' },
      { key: 'staffProfileCode', label: 'Staff Profile Code' },
      { key: 'creditLimit', label: 'Credit Limit [QAR]' },
    ],
    fields: [
      { key: 'cardType', label: 'Card Type', required: true },
      { key: 'issuer', label: 'Issuer' },
      { key: 'minSalary', label: 'Min Salary [QAR]' },
      { key: 'maxSalary', label: 'Max Salary [QAR]' },
      { key: 'cardProduct', label: 'Card Product Code' },
      { key: 'creditLimit', label: 'Credit Limit [QAR]' },
    ],
  },
  {
    key: 'prepaid',
    label: 'Prepaid Card Issuance Management',
    labelKey: 'Card_Issuance_Tab_Prepaid_Card_Issuance_Management',
    service: prepaidCardService,
    Icon: MembershipIcon,
    tone: {
      backgroundColor: '#FFF7EF',
      numberColor: '#EA8A2B',
      iconColor: '#EA8A2B',
      borderColor: '#FFEFD9',
    },
    columns: [
      { key: 'productCode', label: 'Product Code' },
      { key: 'productName', label: 'Product Name' },
      { key: 'englishMailDisclaimer', label: 'English Mail Disclaimer' },
      { key: 'arabicMailDisclaimer', label: 'Arabic Mail Disclaimer' },
      { key: 'profileCode', label: 'Profile Code' },
      { key: 'minLoadAmount', label: 'Min Load Amount' },
      { key: 'issuerId', label: 'Issuer ID' },
      { key: 'feesApplicable', label: 'Fees Applicable' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'productCode', label: 'Product Code', required: true },
      { key: 'productName', label: 'Product Name', required: true },
      { key: 'profileCode', label: 'Profile Code' },
      { key: 'minLoadAmount', label: 'Min Load Amount' },
      { key: 'issuerId', label: 'Issuer ID' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
]

/** Flutter CardIssuanceTablePage */
export default function CardIssuancePage() {
  const [tab, setTab] = useState('preapproved')
  const [counts, setCounts] = useState({ preapproved: 0, salary: 0, prepaid: 0 })
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
    <Box className="card-issuance-page">
      <UIText as="h2" variant="h24SemiBold" className="card-issuance-title">
        {t('Card_Issuance_Page_Title', 'Card Issuance')}
      </UIText>

      <UIMetricCardRow cards={metricCards} />

      <Box className="card-issuance-tabs" role="tablist">
        {TABS.map((item) => {
          const selected = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['card-issuance-tab', selected ? 'is-selected' : '']
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
        actionsRef={actionsRef}
        onRowsChange={(rows) =>
          setCounts((prev) => ({
            ...prev,
            [active.key]: Array.isArray(rows) ? rows.length : 0,
          }))
        }
        title={active.label}
        entityLabel={active.label}
        addLabel={t(`Add_${active.key}`, `Add ${active.label}`)}
        listTitle={active.label}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}
