import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/lookupTypeService'

export default function LookupTypesPage() {
  return (
    <GenericCrudPage
      title="Lookup Types"
      service={service}
      columns={[
        { key: 'lookupType', label: 'Lookup Type' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'lookupType', label: 'Lookup Type', required: true, lockOnEdit: true },
        { key: 'description', label: 'Description', required: true },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
