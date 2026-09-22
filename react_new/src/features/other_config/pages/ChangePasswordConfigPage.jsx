import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/change_password_cfgService'

const columns = [
  {
    "key": "policyCode",
    "label": "Policy Code"
  },
  {
    "key": "minLength",
    "label": "Min Length"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "policyCode",
    "label": "Policy Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "minLength",
    "label": "Min Length",
    "required": true
  },
  {
    "key": "requireSpecial",
    "label": "Require Special",
    "type": "status"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function ChangePasswordConfigPage() {
  return (
    <GenericCrudPage
      title="Change Password Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
