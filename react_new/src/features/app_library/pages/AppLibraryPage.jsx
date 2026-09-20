import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/app_libraryService'

const columns = [
  {
    "key": "libCode",
    "label": "Code"
  },
  {
    "key": "libName",
    "label": "Name"
  },
  {
    "key": "version",
    "label": "Version"
  },
  {
    "key": "platform",
    "label": "Platform"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "libCode",
    "label": "Library Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "libName",
    "label": "Library Name",
    "required": true
  },
  {
    "key": "version",
    "label": "Version",
    "required": true
  },
  {
    "key": "platform",
    "label": "Platform",
    "type": "select",
    "options": [
      {
        "value": "Flutter",
        "label": "Flutter"
      },
      {
        "value": "React",
        "label": "React"
      },
      {
        "value": "Android",
        "label": "Android"
      },
      {
        "value": "iOS",
        "label": "iOS"
      },
      {
        "value": "Shared",
        "label": "Shared"
      }
    ]
  },
  {
    "key": "packageName",
    "label": "Package Name"
  },
  {
    "key": "repositoryUrl",
    "label": "Repository URL"
  },
  {
    "key": "description",
    "label": "Description",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function AppLibraryPage() {
  return (
    <GenericCrudPage
      title="App Library"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default AppLibraryPage
