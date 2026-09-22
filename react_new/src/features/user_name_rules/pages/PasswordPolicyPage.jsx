import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/passwordPolicyService'

const columns = [
  { key: 'policyId', label: 'Policy Id' },
  { key: 'policyName', label: 'Policy Name' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'status', label: 'Status', statusChip: true },
  { key: 'domainDesc', label: 'Domain Desc' },
]

const fields = [
  { key: 'policyId', label: 'Policy Id', required: true },
  { key: 'policyName', label: 'Policy Name' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'status', label: 'Status' },
  { key: 'domainDesc', label: 'Domain Desc' },
]

export default function PasswordPolicyPage() {
  return (
    <GenericCrudPage
      title="Password Policy"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
