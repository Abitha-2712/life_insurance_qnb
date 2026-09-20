import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/currencyService'

export default function CurrencyTablePage() {
  return (
    <GenericCrudPage
      title="Currency"
      service={service}
      columns={[
        { key: 'currencyCode', label: 'Code' },
        { key: 'currencyName', label: 'Name (English)' },
        { key: 'currencyNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'currencyCode', label: 'Code', required: true, lockOnEdit: true },
        { key: 'currencyName', label: 'Name (English)', required: true },
        { key: 'currencyNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
