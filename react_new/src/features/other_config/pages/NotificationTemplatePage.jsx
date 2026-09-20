import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/notification_templateService'

const columns = [
  {
    "key": "templateCode",
    "label": "Code"
  },
  {
    "key": "templateName",
    "label": "Name"
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "templateCode",
    "label": "Template Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "templateName",
    "label": "Template Name",
    "required": true
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "body",
    "label": "Body",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function NotificationTemplatePage() {
  return (
    <GenericCrudPage
      title="Notification Template"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
