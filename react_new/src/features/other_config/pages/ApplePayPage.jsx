import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/apple_payService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'binNumber', label: 'Bin Number' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'binNumber', label: 'Bin Number' },
  { key: 'status', label: 'Status' },
]

export default function ApplePayPage() {
  return (
    <GenericCrudPage
      title="Apple Pay"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
