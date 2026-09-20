import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/subProductService'

const columns = [
  { key: 'domainId', label: 'Domain Id' },
  { key: 'subProductCode', label: 'Sub Product Code' },
  { key: 'subProductDesc', label: 'Sub Product Desc' },
  { key: 'productCode', label: 'Product Code' },
  { key: 'subProductUrl', label: 'Sub Product Url' },
  { key: 'priority', label: 'Priority' },
]

const fields = [
  { key: 'domainId', label: 'Domain Id', required: true },
  { key: 'subProductCode', label: 'Sub Product Code' },
  { key: 'subProductDesc', label: 'Sub Product Desc' },
  { key: 'productCode', label: 'Product Code' },
  { key: 'subProductUrl', label: 'Sub Product Url' },
  { key: 'priority', label: 'Priority' },
]

export default function SubProductManagementPage() {
  return (
    <GenericCrudPage
      title="Sub Product Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
