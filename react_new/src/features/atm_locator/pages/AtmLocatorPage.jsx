import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/atmLocatorService'

const columns = [
  { key: 'locatorId', label: 'Locator Id' },
  { key: 'code', label: 'Code' },
  { key: 'city', label: 'City' },
  { key: 'cityInArabic', label: 'City In Arabic' },
  { key: 'fullAddress', label: 'Full Address' },
  { key: 'fullAddressArb', label: 'Full Address Arb' },
]

const fields = [
  { key: 'locatorId', label: 'Locator Id', required: true },
  { key: 'code', label: 'Code' },
  { key: 'city', label: 'City' },
  { key: 'cityInArabic', label: 'City In Arabic' },
  { key: 'fullAddress', label: 'Full Address' },
  { key: 'fullAddressArb', label: 'Full Address Arb' },
]

export default function AtmLocatorPage() {
  return (
    <GenericCrudPage
      title="ATM Locator"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
