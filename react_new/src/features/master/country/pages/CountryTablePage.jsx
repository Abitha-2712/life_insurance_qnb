import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/countryService'

export default function CountryTablePage() {
  return (
    <GenericCrudPage
      title="Country"
      service={service}
      columns={[
        { key: 'countryCode', label: 'Code' },
        { key: 'countryName', label: 'Name (English)' },
        { key: 'countryNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'countryCode', label: 'Code', required: true, lockOnEdit: true },
        { key: 'countryName', label: 'Name (English)', required: true },
        { key: 'countryNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
