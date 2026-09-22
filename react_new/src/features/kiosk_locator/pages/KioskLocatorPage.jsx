import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/kioskLocatorService'

export default function KioskLocatorPage() {
  return (
    <GenericCrudPage
      title="Kiosk Locator"
      service={service}
      columns={[
        { key: 'kioskCode', label: 'Kiosk Code' },
        { key: 'kioskName', label: 'Kiosk Name' },
        { key: 'city', label: 'City' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'kioskCode', label: 'Kiosk Code', required: true, lockOnEdit: true },
        { key: 'kioskName', label: 'Kiosk Name', required: true },
        { key: 'city', label: 'City' },
        { key: 'address', label: 'Address' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
