import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/google_payService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'bin', label: 'Bin' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'bin', label: 'Bin' },
  { key: 'status', label: 'Status' },
]

export default function GooglePayPage() {
  return (
    <GenericCrudPage
      title="Google Pay"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
