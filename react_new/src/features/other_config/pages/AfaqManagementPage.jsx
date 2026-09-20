import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import {
  afaqWorkingScheduleService,
  afaqHolidayService,
  afaqCountryCurrencyService,
} from '../services/afaqService'
import './AfaqManagementPage.css'

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

function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CurrencyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v10M9 10h4.5a2 2 0 0 1 0 4H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  {
    key: 'schedule',
    label: 'Afaq Working Schedule',
    labelKey: 'Afaq_Working_Schedule',
    metricTitle: 'Total Afaq Working Schedule',
    metricTitleKey: 'Total_Afaq_Working_Schedule',
    addLabel: 'Add Afaq Working Schedule',
    addLabelKey: 'Add_Afaq_Working_Schedule',
    listTitle: 'Afaq Working Schedule List',
    service: afaqWorkingScheduleService,
    Icon: PackageIcon,
    tone: {
      backgroundColor: '#F1F6FF',
      numberColor: '#2563EB',
      iconColor: '#2563EB',
      borderColor: '#D6E7FF',
    },
    columns: [
      { key: 'countryDesc', label: 'Country' },
      { key: 'dayOfWeek', label: 'Day Of Week' },
      { key: 'workingDay', label: 'Working Day' },
      { key: 'startTime', label: 'Start Time' },
      { key: 'endTime', label: 'End Time' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'countryDesc', label: 'Country', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'holiday',
    label: 'Afaq Holiday',
    labelKey: 'Afaq_Holiday',
    metricTitle: 'Total Afaq Holiday',
    metricTitleKey: 'Total_Afaq_Holiday',
    addLabel: 'Add Afaq Holiday',
    addLabelKey: 'Add_Afaq_Holiday',
    listTitle: 'Afaq Holiday List',
    service: afaqHolidayService,
    Icon: EventIcon,
    tone: {
      backgroundColor: '#FFFFFF',
      numberColor: '#485363',
      iconColor: '#94A3B8',
      borderColor: '#E5E7EB',
    },
    columns: [
      { key: 'holidayDate', label: 'Holiday Date' },
      { key: 'countryDesc', label: 'Country' },
      { key: 'descriptionEn', label: 'Description (EN)' },
      { key: 'descriptionAr', label: 'Description (AR)' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'holidayDate', label: 'Holiday Date', required: true },
      { key: 'countryDesc', label: 'Country', required: true },
      { key: 'descriptionEn', label: 'Description (EN)' },
      { key: 'descriptionAr', label: 'Description (AR)' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'currency',
    label: 'Afaq Country Currency',
    labelKey: 'Afaq_Country_Currency',
    metricTitle: 'Total Afaq Country Currency',
    metricTitleKey: 'Total_Afaq_Country_Currency',
    addLabel: 'Add Afaq Country Currency',
    addLabelKey: 'Add_Afaq_Country_Currency',
    listTitle: 'Afaq Country Currency List',
    service: afaqCountryCurrencyService,
    Icon: CurrencyIcon,
    tone: {
      backgroundColor: '#FFFFFF',
      numberColor: '#485363',
      iconColor: '#94A3B8',
      borderColor: '#E5E7EB',
    },
    columns: [
      { key: 'countryDesc', label: 'Country' },
      { key: 'currencyCode', label: 'ISO Code' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'countryCode', label: 'Country Code', required: true },
      { key: 'countryDesc', label: 'Country', required: true },
      { key: 'currencyCode', label: 'Currency Code' },
      { key: 'isoNumber', label: 'ISO Number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  },
]

/**
 * Flutter AfaqTablePage — 3 metric cards + Working Schedule / Holiday / Country Currency tabs.
 */
export default function AfaqManagementPage() {
  const [tab, setTab] = useState('schedule')
  const [counts, setCounts] = useState({ schedule: 0, holiday: 0, currency: 0 })
  const actionsRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.allSettled(
        TABS.map((item) => item.service.fetchAll()),
      )
      if (cancelled) return
      setCounts((prev) => {
        const next = { ...prev }
        results.forEach((res, i) => {
          const key = TABS[i].key
          next[key] = res.status === 'fulfilled' ? (res.value?.data || []).length : 0
        })
        return next
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])
  const active = TABS.find((item) => item.key === tab) || TABS[0]

  const metricCards = useMemo(
    () =>
      TABS.map((item) => {
        const Icon = item.Icon
        return {
          key: item.key,
          title: t(item.metricTitleKey, item.metricTitle),
          subtitle: String(counts[item.key] ?? 0),
          icon: <Icon />,
          ...item.tone,
        }
      }),
    [counts],
  )

  return (
    <Box className="afaq-page">
      <Box className="afaq-header">
        <UIText as="h2" variant="h24SemiBold" className="afaq-title">
          {t('Afaq_Management', 'Afaq Management')}
        </UIText>
        <UIAddButton
          label={t(active.addLabelKey, active.addLabel)}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>

      <UIMetricCardRow cards={metricCards} />

      <Box className="afaq-tabs" role="tablist">
        {TABS.map((item) => {
          const selected = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['afaq-tab', selected ? 'is-selected' : '']
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
        listTitle={t(active.listTitle, active.listTitle)}
        service={active.service}
        columns={active.columns}
        fields={active.fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}

