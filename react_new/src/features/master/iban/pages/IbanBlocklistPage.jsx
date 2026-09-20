import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/ibanService'

export default function IbanBlocklistPage() {
  return (
    <GenericCrudPage
      title="IBAN Block List"
      service={service}
      columns={[
        { key: 'iban', label: 'IBAN' },
        { key: 'reason', label: 'Reason' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'iban', label: 'IBAN', required: true, lockOnEdit: true },
        { key: 'reason', label: 'Reason', required: true },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
