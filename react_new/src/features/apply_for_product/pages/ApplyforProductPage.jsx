import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import {
  UISummaryStatusRow,
} from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/apply_for_productService'
import './ApplyforProductPage.css'

const columns = [
  { key: 'productCode', label: 'Product Code' },
  { key: 'productNameEn', label: 'Product Name (EN)' },
  { key: 'productNameAr', label: 'Product Name (AR)' },
  { key: 'productDescriptionEn', label: 'Description (EN)' },
  { key: 'productDescriptionAr', label: 'Description (AR)' },
  { key: 'imageEn', label: 'Image En', image: true },
  { key: 'imageAr', label: 'Image Ar', image: true },
  { key: 'imageUrlEn', label: 'Image URL (English)' },
  { key: 'imageUrlAr', label: 'Image URL (Arabic)' },
  { key: 'backgroundImageEn', label: 'Background image (English)', image: true },
  { key: 'backgroundImageAr', label: 'Background image (Arabic)', image: true },
  { key: 'backgroundImageUrlEn', label: 'Background image URL (English)' },
  { key: 'backgroundImageUrlAr', label: 'Background image URL (Arabic)' },
  { key: 'priorityOrder', label: 'Priority' },
  { key: 'enabled', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
  { key: 'productNameEn', label: 'Product Name (EN)', required: true },
  { key: 'productNameAr', label: 'Product Name (AR)' },
  { key: 'productDescriptionEn', label: 'Description (EN)', type: 'textarea' },
  { key: 'productDescriptionAr', label: 'Description (AR)', type: 'textarea' },
  { key: 'imageEn', label: 'Image En (URL or base64)', type: 'textarea' },
  { key: 'imageAr', label: 'Image Ar (URL or base64)', type: 'textarea' },
  { key: 'imageUrlEn', label: 'Image URL (English)' },
  { key: 'imageUrlAr', label: 'Image URL (Arabic)' },
  { key: 'backgroundImageEn', label: 'Background Image EN', type: 'textarea' },
  { key: 'backgroundImageAr', label: 'Background Image AR', type: 'textarea' },
  { key: 'backgroundImageUrlEn', label: 'Background Image URL (EN)' },
  { key: 'backgroundImageUrlAr', label: 'Background Image URL (AR)' },
  { key: 'priorityOrder', label: 'Priority' },
  { key: 'enabled', label: 'Status', type: 'status' },
]

/** Flutter ApplyProductPage — CMS Product / Apply Products detail */
export default function ApplyforProductPage() {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 })
  const [statusFilter, setStatusFilter] = useState('all')

  const isActive = (s) => ['Y', 'YES', 'ACT', 'ACTIVE', 'ENABLED'].includes(String(s || '').toUpperCase())

  const rowFilter = useMemo(() => {
    if (statusFilter === 'all') return null
    return (rows) =>
      (rows || []).filter((r) => {
        const active = isActive(r.enabled || r.status)
        return statusFilter === 'active' ? active : !active
      })
  }, [statusFilter])

  return (
    <Box className="apply-product-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Products', 'Total Products')}
        activeLabel={t('Active_Products', 'Active Products')}
        inactiveLabel={t('Inactive_Products', 'Inactive Products')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="apply-product-crud"
        title={t('Product', 'Product')}
        addLabel={t('Add_Retail_Product', 'Add Retail Product')}
        service={service}
        columns={columns}
        fields={fields}
        statusKey="enabled"
        enableStatusFilter={false}
        rowFilter={rowFilter}
        onRowsChange={(rows) => {
          const list = Array.isArray(rows) ? rows : []
          const active = list.filter((r) => isActive(r.enabled || r.status)).length
          setCounts({ total: list.length, active, inactive: list.length - active })
        }}
      />
    </Box>
  )
}
