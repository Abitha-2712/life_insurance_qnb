import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/lookupService'

export default function LookupsPage() {
  return (
    <GenericCrudPage
      title="Lookups"
      service={service}
      columns={[
        { key: 'lookupCode', label: 'Code' },
        { key: 'lookupValue', label: 'Value' },
        { key: 'lookupType', label: 'Type' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'lookupCode', label: 'Code', required: true, lockOnEdit: true },
        { key: 'lookupValue', label: 'Value', required: true },
        { key: 'lookupType', label: 'Type', required: true },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
