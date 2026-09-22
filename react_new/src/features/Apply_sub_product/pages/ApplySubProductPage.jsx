import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UISummaryStatusRow } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/Apply_sub_productService'
import './ApplySubProductPage.css'

const columns = [
  { key: 'subProductCode', label: 'Code' },
  { key: 'nameEn', label: 'Name (EN)' },
  { key: 'nameAr', label: 'Name (AR)' },
  { key: 'productName', label: 'Product' },
  { key: 'imageEn', label: 'Image EN', image: true },
  { key: 'imageAr', label: 'Image AR', image: true },
  { key: 'priority', label: 'Priority' },
  { key: 'enableFlag', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'subProductCode', label: 'Sub Product Code', required: true, lockOnEdit: true },
  { key: 'nameEn', label: 'Name (EN)', required: true },
  { key: 'nameAr', label: 'Name (AR)' },
  { key: 'productName', label: 'Product' },
  { key: 'imageEn', label: 'Image EN (URL or base64)', type: 'textarea' },
  { key: 'imageAr', label: 'Image AR (URL or base64)', type: 'textarea' },
  { key: 'priority', label: 'Priority' },
  { key: 'enableFlag', label: 'Status', type: 'status' },
]

/** Flutter ApplySubProductTablePage — CMS Sub Product */
export default function ApplySubProductPage() {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const isActive = (s) => ['Y', 'YES', 'ACT', 'ACTIVE', 'ENABLED'].includes(String(s || '').toUpperCase())

  const rowFilter = useMemo(() => {
    if (statusFilter === 'all') return null
    return (rows) =>
      (rows || []).filter((r) => {
        const active = isActive(r.enableFlag || r.status)
        return statusFilter === 'active' ? active : !active
      })
  }, [statusFilter])

  return (
    <Box className="apply-sub-product-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Sub_Products', 'Total Sub-Products')}
        activeLabel={t('Active_Sub_Products', 'Active Sub-Products')}
        inactiveLabel={t('Inactive_Sub_Products', 'Inactive Sub-Products')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="apply-sub-product-crud"
        title={t('Sub_Product', 'Sub Product')}
        addLabel={t('Add_Sub_Product', 'Add Sub Product')}
        service={service}
        columns={columns}
        fields={fields}
        statusKey="enableFlag"
        enableStatusFilter={false}
        rowFilter={rowFilter}
        onRowsChange={(rows) => {
          const list = Array.isArray(rows) ? rows : []
          const active = list.filter((r) => isActive(r.enableFlag || r.status)).length
          setCounts({ total: list.length, active, inactive: list.length - active })
        }}
      />
    </Box>
  )
}
