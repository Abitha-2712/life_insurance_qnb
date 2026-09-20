import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UISummaryStatusRow } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import service from '../services/follow_usService'
import './FollowUsReachUsPage.css'

const columns = [
  { key: 'rowNumber', label: 'Row #' },
  { key: 'groupInEnglish', label: 'Group (EN)' },
  { key: 'englishName', label: 'Name (EN)' },
  { key: 'arabicName', label: 'Name (AR)' },
  { key: 'englishLink', label: 'Link (EN)' },
  { key: 'arabicLink', label: 'Link (AR)' },
  { key: 'imageBase64', label: 'Image', image: true },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'rowNumber', label: 'Row Number', required: true },
  { key: 'groupInEnglish', label: 'Group (EN)', required: true },
  { key: 'groupInArabic', label: 'Group (AR)' },
  { key: 'englishName', label: 'Name (EN)', required: true },
  { key: 'arabicName', label: 'Name (AR)' },
  { key: 'englishLink', label: 'Link (EN)', required: true },
  { key: 'arabicLink', label: 'Link (AR)' },
  { key: 'imageName', label: 'Image Name' },
  { key: 'imageBase64', label: 'Image (URL or base64)', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'status' },
]

/**
 * Flutter FollowUsPage — CMS Manage Links (route: link_configuration)
 * Also used historically as Follow Us.
 */
export default function FollowUsReachUsPage() {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const isActive = (s) =>
    ['Y', 'YES', 'ACT', 'ACTIVE', 'ENABLED'].includes(String(s || '').toUpperCase())
  const rowFilter = useMemo(() => {
    if (statusFilter === 'all') return null
    return (rows) =>
      (rows || []).filter((r) => {
        const active = isActive(r.status)
        return statusFilter === 'active' ? active : !active
      })
  }, [statusFilter])

  return (
    <Box className="manage-links-page">
      <UISummaryStatusRow
        totalCount={counts.total}
        activeCount={counts.active}
        inactiveCount={counts.inactive}
        totalLabel={t('Total_Links', 'Total Links')}
        activeLabel={t('Active_Links', 'Active Links')}
        inactiveLabel={t('Inactive_Links', 'Inactive Links')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <GenericCrudPage
        className="manage-links-crud"
        title={t('Manage_Links', 'Manage Links')}
        addLabel={t('Add_Link', 'Add Link')}
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
