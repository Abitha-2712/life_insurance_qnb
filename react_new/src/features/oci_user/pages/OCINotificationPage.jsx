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
    "key": "notifyEmail",
    "label": "Email Notify"
  },
  {
    "key": "notifySms",
    "label": "SMS Notify"
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
    "label": "Email"
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

function OCINotificationPage() {
  return (
    <GenericCrudPage
      title="OCI User Notification"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default OCINotificationPage
