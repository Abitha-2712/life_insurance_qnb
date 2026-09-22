import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UISummaryStatusRow } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/reachUsService'
import './ReachUsPage.css'

const columns = [
  { key: 'nameEn', label: 'Feature Name (EN)' },
  { key: 'nameAr', label: 'Feature Name (AR)' },
  { key: 'descEn', label: 'Description (EN)' },
  { key: 'priority', label: 'Priority' },
  { key: 'imageEn', label: 'Image EN', image: true },
  { key: 'imageAr', label: 'Image AR', image: true },
  { key: 'imageUrlEn', label: 'Image URL EN' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'nameEn', label: 'Feature Name (EN)', required: true },
  { key: 'nameAr', label: 'Feature Name (AR)' },
  { key: 'descEn', label: 'Description (EN)', required: true, type: 'textarea' },
  { key: 'descAr', label: 'Description (AR)', type: 'textarea' },
  { key: 'priority', label: 'Priority', required: true },
  { key: 'imageEn', label: 'Image EN (URL or base64)', type: 'textarea' },
  { key: 'imageAr', label: 'Image AR (URL or base64)', type: 'textarea' },
  { key: 'imageNameEn', label: 'Image Name EN' },
  { key: 'imageNameAr', label: 'Image Name AR' },
  { key: 'imageUrlEn', label: 'Image / Deeplink URL EN' },
  { key: 'imageUrlAr', label: 'Image / Deeplink URL AR' },
  { key: 'status', label: 'Status', type: 'status' },
]

/** Flutter ReachUsTablePage — CMS Reach Us */
export default function ReachUsPage() {
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
    <Box className="reach-us-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Reach_Us', 'Total Reach Us')}
        activeLabel={t('Active_Reach_Us', 'Active')}
        inactiveLabel={t('Inactive_Reach_Us', 'Inactive')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="reach-us-crud"
        title={t('Reach_Us', 'Reach Us')}
        addLabel={t('Add_Reach_Us', 'Add Reach Us')}
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
