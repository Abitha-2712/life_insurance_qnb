import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/default_parameterService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'parameterName', label: 'Parameter Name' },
  { key: 'parameterValue', label: 'Parameter Value' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'parameterName', label: 'Parameter Name' },
  { key: 'parameterValue', label: 'Parameter Value' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'status', label: 'Status' },
]

export default function DefaultParameterPage() {
  return (
    <GenericCrudPage
      title="Default Parameter"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
