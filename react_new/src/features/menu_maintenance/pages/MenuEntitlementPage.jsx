import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/menu_maintenanceService'

const columns = [
  { key: 'menuCode', label: 'Menu Code' },
  { key: 'menuDesc', label: 'Description' },
  { key: 'roleCode', label: 'Role' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'menuCode', label: 'Menu Code', required: true, lockOnEdit: true },
  { key: 'menuDesc', label: 'Description', required: true },
  { key: 'parentMenuCode', label: 'Parent Menu' },
  { key: 'roleCode', label: 'Role Code' },
  { key: 'sequence', label: 'Sequence' },
  { key: 'status', label: 'Status', type: 'status' },
]

function MenuEntitlementPage() {
  return (
    <GenericCrudPage
      title="Menu Entitlement"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default MenuEntitlementPage
