import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/passwordConfigService'

const columns = [
  {
    "key": "configCode",
    "label": "Config Code"
  },
  {
    "key": "configName",
    "label": "Name"
  },
  {
    "key": "minLength",
    "label": "Min"
  },
  {
    "key": "requireSpecial",
    "label": "Special"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "configCode",
    "label": "Config Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "configName",
    "label": "Name",
    "required": true
  },
  {
    "key": "minLength",
    "label": "Min Length",
    "defaultValue": "8"
  },
  {
    "key": "maxLength",
    "label": "Max Length",
    "defaultValue": "64"
  },
  {
    "key": "requireUpper",
    "label": "Require Uppercase",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "requireLower",
    "label": "Require Lowercase",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "requireDigit",
    "label": "Require Digit",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "requireSpecial",
    "label": "Require Special",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "historyCount",
    "label": "Password History Count",
    "defaultValue": "5"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function PasswordConfigPage() {
  return (
    <GenericCrudPage
      title="Password Configurations"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default PasswordConfigPage
