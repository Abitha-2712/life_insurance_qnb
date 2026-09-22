import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/ready_to_sync_tableService'

const columns = [
  {
    "key": "tableName",
    "label": "Table"
  },
  {
    "key": "schemaName",
    "label": "Schema"
  },
  {
    "key": "ready",
    "label": "Ready"
  },
  {
    "key": "pendingChanges",
    "label": "Pending"
  },
  {
    "key": "lastSynced",
    "label": "Last Synced"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "tableName",
    "label": "Table Name",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "schemaName",
    "label": "Schema"
  },
  {
    "key": "ready",
    "label": "Ready",
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
    "key": "pendingChanges",
    "label": "Pending Changes"
  },
  {
    "key": "lastValidated",
    "label": "Last Validated"
  },
  {
    "key": "lastSynced",
    "label": "Last Synced"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function ReadyToSyncPage() {
  return (
    <GenericCrudPage
      title="Ready To Sync"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ReadyToSyncPage
