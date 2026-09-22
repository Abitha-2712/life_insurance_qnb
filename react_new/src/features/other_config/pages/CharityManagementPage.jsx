import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/charityService'

const columns = [
  { key: 'charityId', label: 'Id' },
  { key: 'englishName', label: 'Name (EN)' },
  { key: 'arabicName', label: 'Name (AR)' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'englishName', label: 'Name (English)', required: true },
  { key: 'arabicName', label: 'Name (Arabic)' },
  { key: 'status', label: 'Status', type: 'status' },
]

export default function CharityManagementPage() {
  return (
    <GenericCrudPage title="Charity Management" service={service} columns={columns} fields={fields} />
  )
}
