import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  occupationService,
  employerService,
  sectorTypeService,
  countryService,
  cityService,
} from '../services/employment_mastersService'
import './EmploymentMastersPage.css'

const TABS = [
  {
    key: 'occupation',
    label: 'Occupation',
    service: occupationService,
    addLabel: 'Add Occupation',
    listTitle: 'List of Occupations',
    entityLabel: 'Occupation',
    pdfFileName: 'occupations.pdf',
    excelFileName: 'occupations.xlsx',
    columns: [
      { key: 'occupationName', label: 'Occupation Name (English)' },
      { key: 'occupationNameAr', label: 'Occupation Name (Arabic)' },
      { key: 'displayOrder', label: 'Priority' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'occupationName', label: 'Occupation Name (EN)', required: true },
      { key: 'occupationNameAr', label: 'Occupation Name (AR)' },
      { key: 'displayOrder', label: 'Priority' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    tone: {
      backgroundColor: '#F1F6FF',
      numberColor: '#2563EB',
      iconColor: '#2563EB',
      borderColor: '#D6E7FF',
    },
    Icon: WorkIcon,
  },
  {
    key: 'employer',
    label: 'Employer',
    service: employerService,
    addLabel: 'Add Employer',
    listTitle: 'List of Employers',
    entityLabel: 'Employer',
    pdfFileName: 'employers.pdf',
    excelFileName: 'employers.xlsx',
    columns: [
      { key: 'employerId', label: 'Id' },
      { key: 'employerName', label: 'Name (EN)' },
      { key: 'employerNameAr', label: 'Name (AR)' },
      { key: 'displayOrder', label: 'Order' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'employerName', label: 'Employer Name (EN)', required: true },
      { key: 'employerNameAr', label: 'Employer Name (AR)' },
      { key: 'displayOrder', label: 'Display Order' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    tone: {
      backgroundColor: '#FFFFFF',
      numberColor: '#485363',
      iconColor: '#94A3B8',
      borderColor: '#E5E7EB',
    },
    Icon: BusinessIcon,
  },
  {
    key: 'sectorType',
    label: 'Sector Type',
    service: sectorTypeService,
    addLabel: 'Add Sector Type',
    listTitle: 'List of Sector Types',
    entityLabel: 'Sector Type',
    pdfFileName: 'sector_types.pdf',
    excelFileName: 'sector_types.xlsx',
    columns: [
      { key: 'sectorTypeName', label: 'Name (EN)' },
      { key: 'sectorTypeNameAr', label: 'Name (AR)' },
      { key: 'displayOrder', label: 'Order' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'sectorTypeName', label: 'Sector Type Name (EN)', required: true },
      { key: 'sectorTypeNameAr', label: 'Sector Type Name (AR)' },
      { key: 'displayOrder', label: 'Display Order' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    tone: {
      backgroundColor: '#FFF7EF',
      numberColor: '#EA8A2B',
      iconColor: '#EA8A2B',
      borderColor: '#FFEFD9',
    },
    Icon: CategoryIcon,
  },
  {
    key: 'country',
    label: 'Country',
    service: countryService,
    addLabel: 'Add Country',
    listTitle: 'List of Countries',
    entityLabel: 'Country',
    pdfFileName: 'countries.pdf',
    excelFileName: 'countries.xlsx',
    columns: [
      { key: 'countryCode', label: 'Code' },
      { key: 'countryName', label: 'Name (EN)' },
      { key: 'countryNameAr', label: 'Name (AR)' },
      { key: 'displayOrder', label: 'Order' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'countryCode', label: 'Country Code', required: true, lockOnEdit: true },
      { key: 'countryName', label: 'Country Name (EN)', required: true },
      { key: 'countryNameAr', label: 'Country Name (AR)' },
      { key: 'displayOrder', label: 'Display Order' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    tone: {
      backgroundColor: '#F0FDFA',
      numberColor: '#0D9488',
      iconColor: '#0D9488',
      borderColor: '#CCFBF1',
    },
    Icon: PublicIcon,
  },
  {
    key: 'city',
    label: 'City',
    service: cityService,
    addLabel: 'Add City',
    listTitle: 'List of Cities',
    entityLabel: 'City',
    pdfFileName: 'cities.pdf',
    excelFileName: 'cities.xlsx',
    columns: [
      { key: 'cityCode', label: 'Code' },
      { key: 'cityName', label: 'Name (EN)' },
      { key: 'cityNameAr', label: 'Name (AR)' },
      { key: 'countryCode', label: 'Country' },
      { key: 'displayOrder', label: 'Order' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'cityCode', label: 'City Code', required: true, lockOnEdit: true },
      { key: 'cityName', label: 'City Name (EN)', required: true },
      { key: 'cityNameAr', label: 'City Name (AR)' },
      { key: 'countryCode', label: 'Country Code', required: true },
      { key: 'displayOrder', label: 'Display Order' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    tone: {
      backgroundColor: '#F5F3FF',
      numberColor: '#7C3AED',
      iconColor: '#7C3AED',
      borderColor: '#E9D5FF',
    },
    Icon: CityIcon,
  },
]

function WorkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l5 8H7l5-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="3" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="16.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function PublicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function CityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 21V9l6-3v15M10 21V6l10 4v11M7 12h1M7 15h1M14 12h2M14 15h2M14 18h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Flutter EmploymentMasterTablePage â€” hub with live category metric cards + tabs.
 * Each tab embeds its own CRUD list (Add label / columns / APIs differ per feature).
 */
function EmploymentMastersPage() {
  const [selectedTab, setSelectedTab] = useState('occupation')
  const [counts, setCounts] = useState({
    occupation: 0,
    employer: 0,
    sectorType: 0,
    country: 0,
    city: 0,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.allSettled(
        TABS.map((tab) => tab.service.fetchAll()),
      )
      if (cancelled) return
      setCounts((prev) => {
        const next = { ...prev }
        results.forEach((res, i) => {
          const key = TABS[i].key
          next[key] =
            res.status === 'fulfilled' ? (res.value?.data || []).length : 0
        })
        return next
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleRowsChange = useCallback((tabKey) => {
    return (rows) => {
      setCounts((prev) => {
        const nextCount = Array.isArray(rows) ? rows.length : 0
        if (prev[tabKey] === nextCount) return prev
        return { ...prev, [tabKey]: nextCount }
      })
    }
  }, [])

  const metricCards = useMemo(
    () =>
      TABS.map((tab) => {
        const Icon = tab.Icon
        return {
          key: tab.key,
          title: t(tab.label, tab.label),
          subtitle: String(counts[tab.key] ?? 0),
          icon: <Icon />,
          selected: selectedTab === tab.key,
          onClick: () => setSelectedTab(tab.key),
          ...tab.tone,
        }
      }),
    [counts, selectedTab],
  )

  const active = TABS.find((tab) => tab.key === selectedTab) || TABS[0]

  return (
    <Box className="employment-masters-page">
      <UIText as="h2" variant="h24SemiBold" className="employment-masters-title">
        {t('Employment_Masters', 'Employment Masters')}
      </UIText>

      <UIMetricCardRow cards={metricCards} />

      <Box className="employment-masters-tabs" role="tablist" aria-label="Employment Masters">
        {TABS.map((tab) => {
          const Icon = tab.Icon
          const selected = selectedTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['employment-masters-tab', selected ? 'is-selected' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedTab(tab.key)}
            >
              <span className="employment-masters-tab-icon" style={{ color: selected ? tab.tone.iconColor : '#94A3B8' }} aria-hidden="true"><Icon /></span>
              {t(tab.label, tab.label)}
            </button>
          )
        })}
      </Box>

      <GenericCrudPage
        key={active.key}
        embedded
        title={active.label}
        entityLabel={active.entityLabel}
        addLabel={t(active.addLabel, active.addLabel)}
        listTitle={t(active.listTitle, active.listTitle)}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
        pdfFileName={active.pdfFileName}
        excelFileName={active.excelFileName}
        onRowsChange={handleRowsChange(active.key)}
      />
    </Box>
  )
}

export default EmploymentMastersPage

