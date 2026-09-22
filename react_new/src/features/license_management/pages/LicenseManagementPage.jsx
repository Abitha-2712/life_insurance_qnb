import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/license_managementService'

const columns = [
  { key: 'licenseId', label: 'License Id' },
  { key: 'domainName', label: 'Domain Name' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'warningStatus', label: 'Warning Status', statusChip: true },
  { key: 'alertStatus', label: 'Alert Status' },
  { key: 'status', label: 'Status' },
]

const fields = [
  { key: 'licenseId', label: 'License Id', required: true },
  { key: 'domainName', label: 'Domain Name' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'warningStatus', label: 'Warning Status' },
  { key: 'alertStatus', label: 'Alert Status' },
  { key: 'status', label: 'Status' },
]

export default function LicenseManagementPage() {
  return (
    <GenericCrudPage
      title="License Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
