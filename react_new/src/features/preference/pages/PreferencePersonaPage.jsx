import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UISummaryStatusRow } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/preferenceService'
import './PreferencePersonaPage.css'

const columns = [
  { key: 'personaNameEn', label: 'Persona Name (EN)' },
  { key: 'personaNameAr', label: 'Persona Name (AR)' },
  { key: 'priority', label: 'Priority' },
  { key: 'imageEn', label: 'Image EN', image: true },
  { key: 'imageAr', label: 'Image AR', image: true },
  { key: 'urlEn', label: 'URL EN' },
  { key: 'urlAr', label: 'URL AR' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'personaNameEn', label: 'Persona Name (EN)', required: true },
  { key: 'personaNameAr', label: 'Persona Name (AR)' },
  { key: 'priority', label: 'Priority', required: true },
  { key: 'imageEn', label: 'Image EN (URL or base64)', type: 'textarea' },
  { key: 'imageAr', label: 'Image AR (URL or base64)', type: 'textarea' },
  { key: 'urlEn', label: 'URL EN' },
  { key: 'urlAr', label: 'URL AR' },
  { key: 'status', label: 'Status', type: 'status' },
]

/** Flutter PreferenceTablePage — CMS Preference (Personas) */
export default function PreferencePersonaPage() {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const isActive = (s) => ['Y', 'YES', 'ACT', 'ACTIVE'].includes(String(s || '').toUpperCase())
  const rowFilter = useMemo(() => {
    if (statusFilter === 'all') return null
    return (rows) =>
      (rows || []).filter((r) => {
        const active = isActive(r.status)
        return statusFilter === 'active' ? active : !active
      })
  }, [statusFilter])

  return (
    <Box className="preference-persona-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Personas', 'Total Personas')}
        activeLabel={t('Active_Personas', 'Active Personas')}
        inactiveLabel={t('Inactive_Personas', 'Inactive Personas')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="preference-persona-crud"
        title={t('Preference_Personas', 'Preference (Personas)')}
        addLabel={t('Add_Persona', 'Add Persona')}
        service={service}
        columns={columns}
        fields={fields}
        enableStatusFilter={false}
        rowFilter={rowFilter}
        onRowsChange={(rows) => {
          const list = Array.isArray(rows) ? rows : []
          const active = list.filter((r) => isActive(r.status)).length
          setCounts({ total: list.length, active, inactive: list.length - active })
        }}
      />
    </Box>
  )
}
