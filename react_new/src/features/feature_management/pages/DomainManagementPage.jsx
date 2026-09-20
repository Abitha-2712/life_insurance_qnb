import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/domainService'

const columns = [
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
  { key: 'status', label: 'Status', statusChip: true },
  { key: 'priority', label: 'Priority' },
]

const fields = [
  { key: 'domainId', label: 'Domain Id', required: true },
  { key: 'domainDesc', label: 'Domain Desc' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
]

export default function DomainManagementPage() {
  return (
    <GenericCrudPage
      title="Domain Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
