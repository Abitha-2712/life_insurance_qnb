import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/release_managementService'

const columns = [
  {
    "key": "version",
    "label": "Version"
  },
  {
    "key": "platform",
    "label": "Platform"
  },
  {
    "key": "releaseDate",
    "label": "Release Date"
  },
  {
    "key": "forceUpdate",
    "label": "Force Update"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "version",
    "label": "Version",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "platform",
    "label": "Platform",
    "type": "select",
    "required": true,
    "options": [
      {
        "value": "Android",
        "label": "Android"
      },
      {
        "value": "iOS",
        "label": "iOS"
      },
      {
        "value": "ALL",
        "label": "All"
      }
    ],
    "defaultValue": "Android"
  },
  {
    "key": "releaseDate",
    "label": "Release Date",
    "required": true
  },
  {
    "key": "releaseNotes",
    "label": "Release Notes (EN)",
    "type": "textarea"
  },
  {
    "key": "releaseNotesAr",
    "label": "Release Notes (AR)",
    "type": "textarea"
  },
  {
    "key": "forceUpdate",
    "label": "Force Update",
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

function ReleaseManagementPage() {
  return (
    <GenericCrudPage
      title="Release Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ReleaseManagementPage
