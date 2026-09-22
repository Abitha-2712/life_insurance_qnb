import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/accountClassService'

export default function AccountClassPage() {
  return (
    <GenericCrudPage
      title="Account Class"
      service={service}
      columns={[
        { key: 'classCode', label: 'Class Code' },
        { key: 'className', label: 'Class Name' },
        { key: 'classNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'classCode', label: 'Class Code', required: true, lockOnEdit: true },
        { key: 'className', label: 'Class Name (English)', required: true },
        { key: 'classNameAr', label: 'Class Name (Arabic)' },
        { key: 'segmentCode', label: 'Segment Code' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
