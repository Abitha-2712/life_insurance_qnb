import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/oci_userService'

const columns = [
  {
    "key": "userId",
    "label": "User ID"
  },
  {
    "key": "userName",
    "label": "Name"
  },
  {
    "key": "email",
    "label": "Email"
  },
  {
    "key": "role",
    "label": "Role"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "userId",
    "label": "User ID",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "userName",
    "label": "User Name",
    "required": true
  },
  {
    "key": "email",
    "label": "Email",
    "required": true
  },
  {
    "key": "role",
    "label": "Role",
    "type": "select",
    "options": [
      {
        "value": "ADMIN",
        "label": "Admin"
      },
      {
        "value": "OPERATOR",
        "label": "Operator"
      },
      {
        "value": "VIEWER",
        "label": "Viewer"
      }
    ],
    "defaultValue": "OPERATOR"
  },
  {
    "key": "department",
    "label": "Department"
  },
  {
    "key": "notifyEmail",
    "label": "Email Notify",
    "type": "select",
    "options": [
      {
        "value": "Y",
        "label": "Yes"
      },
      {
        "value": "N",
        "label": "No"
      }
    ],
    "defaultValue": "Y"
  },
  {
    "key": "notifySms",
    "label": "SMS Notify",
    "type": "select",
    "options": [
      {
        "value": "Y",
        "label": "Yes"
      },
      {
        "value": "N",
        "label": "No"
      }
    ],
    "defaultValue": "N"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function OCIUserManagementPage() {
  return (
    <GenericCrudPage
      title="OCI User Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default OCIUserManagementPage
