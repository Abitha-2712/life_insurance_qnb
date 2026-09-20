import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/segment_access_managementService'

const columns = [
  { key: 'segmentCode', label: 'Segment Code' },
  { key: 'segmentName', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'segmentCode', label: 'Segment Code', required: true, lockOnEdit: true },
  { key: 'segmentName', label: 'Name (English)', required: true },
  { key: 'segmentNameAr', label: 'Name (Arabic)' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status', type: 'status' },
]

function SegmentAccessPage() {
  return (
    <GenericCrudPage
      title="Segment Access"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default SegmentAccessPage
