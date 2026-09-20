import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/feature_managementService'

const columns = [
  { key: 'domainId', label: 'Domain Id' },
  { key: 'functionCode', label: 'Function Code' },
  { key: 'functionDesc', label: 'Function Desc' },
  { key: 'productCode', label: 'Product Code' },
  { key: 'subProductCode', label: 'Sub Product Code' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'domainId', label: 'Domain Id', required: true },
  { key: 'functionCode', label: 'Function Code' },
  { key: 'functionDesc', label: 'Function Desc' },
  { key: 'productCode', label: 'Product Code' },
  { key: 'subProductCode', label: 'Sub Product Code' },
  { key: 'status', label: 'Status' },
]

export default function FeatureManagementPage() {
  return (
    <GenericCrudPage
      title="Feature Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
