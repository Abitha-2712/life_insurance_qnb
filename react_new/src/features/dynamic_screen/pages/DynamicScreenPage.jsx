import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/dynamic_screenService'

const columns = [
  {
    "key": "screenCode",
    "label": "Code"
  },
  {
    "key": "screenName",
    "label": "Name"
  },
  {
    "key": "screenType",
    "label": "Type"
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
    "key": "screenCode",
    "label": "Screen Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "screenName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "screenNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "screenType",
    "label": "Screen Type",
    "type": "select",
    "options": [
      {
        "value": "SPLASH",
        "label": "SPLASH"
      },
      {
        "value": "BANNER",
        "label": "BANNER"
      },
      {
        "value": "DYNAMIC",
        "label": "DYNAMIC"
      },
      {
        "value": "FORM",
        "label": "FORM"
      }
    ],
    "defaultValue": "DYNAMIC"
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
    "key": "layoutJson",
    "label": "Layout JSON",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function DynamicScreenPage() {
  return (
    <GenericCrudPage
      title="Dynamic Screen"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default DynamicScreenPage
