import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UISummaryStatusRow } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/merchant_managementService'
import './MerchantManagementPage.css'

const columns = [
  { key: 'merchantCode', label: 'Merchant Code' },
  { key: 'merchantNameEn', label: 'Name (EN)' },
  { key: 'merchantNameAr', label: 'Name (AR)' },
  { key: 'sectorName', label: 'Sector' },
  { key: 'merchantImageEn', label: 'Image EN', image: true },
  { key: 'merchantImageAr', label: 'Image AR', image: true },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'merchantCode', label: 'Merchant Code', required: true, lockOnEdit: true },
  { key: 'merchantNameEn', label: 'Name (EN)', required: true },
  { key: 'merchantNameAr', label: 'Name (AR)', required: true },
  { key: 'sectorId', label: 'Sector ID', required: true },
  { key: 'merchantImageEn', label: 'Image EN (URL or base64)', type: 'textarea', required: true },
  { key: 'merchantImageAr', label: 'Image AR (URL or base64)', type: 'textarea', required: true },
  { key: 'status', label: 'Status', type: 'status' },
]

/** Flutter MerchantManagementPage */
export default function MerchantManagementPage() {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const isActive = (s) =>
    ['Y', 'YES', 'A', 'ACT', 'ACTIVE'].includes(String(s || '').toUpperCase())
  const rowFilter = useMemo(() => {
    if (statusFilter === 'all') return null
    return (rows) =>
      (rows || []).filter((r) => {
        const active = isActive(r.status)
        return statusFilter === 'active' ? active : !active
      })
  }, [statusFilter])

  return (
    <Box className="merchant-management-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Merchants', 'Total Merchants')}
        activeLabel={t('Active_Merchants', 'Active Merchants')}
        inactiveLabel={t('Inactive_Merchants', 'Inactive Merchants')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="merchant-management-crud"
        title={t('Merchant_Management', 'Merchant Management')}
        addLabel={t('Add_Merchant', 'Add Merchant')}
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
