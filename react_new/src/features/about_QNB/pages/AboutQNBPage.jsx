import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/about_QNBService'

const columns = [
  {
    "key": "contentCode",
    "label": "Code"
  },
  {
    "key": "title",
    "label": "Title"
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "version",
    "label": "Version"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "contentCode",
    "label": "Content Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "title",
    "label": "Title (English)",
    "required": true
  },
  {
    "key": "titleAr",
    "label": "Title (Arabic)"
  },
  {
    "key": "contentEn",
    "label": "Content (English)",
    "type": "textarea",
    "required": true
  },
  {
    "key": "contentAr",
    "label": "Content (Arabic)",
    "type": "textarea"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "ALL"
  },
  {
    "key": "version",
    "label": "Version"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function AboutQNBPage() {
  return (
    <GenericCrudPage
      title="About QNB"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default AboutQNBPage
