import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/roleService'

const columns = [
  { key: 'roleId', label: 'Role Id' },
  { key: 'userLevelName', label: 'User Level Name' },
  { key: 'userLevel', label: 'User Level' },
  { key: 'status', label: 'Status', statusChip: true },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
]

const fields = [
  { key: 'roleId', label: 'Role Id', required: true },
  { key: 'userLevelName', label: 'User Level Name' },
  { key: 'userLevel', label: 'User Level' },
  { key: 'status', label: 'Status' },
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
]

export default function RoleManagementPage() {
  return (
    <GenericCrudPage
      title="Role Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
