import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/rule_managementService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'ruleName', label: 'Rule Name' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
  { key: 'product', label: 'Product' },
  { key: 'productDesc', label: 'Product Desc' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'ruleName', label: 'Rule Name' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
  { key: 'product', label: 'Product' },
  { key: 'productDesc', label: 'Product Desc' },
]

export default function RuleManagementPage() {
  return (
    <GenericCrudPage
      title="Rule Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
