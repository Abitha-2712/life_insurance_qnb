import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/sync_table_managementService'

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
    "key": "lastSync",
    "label": "Last Sync"
  },
  {
    "key": "syncStatus",
    "label": "Sync Status"
  },
  {
    "key": "recordCount",
    "label": "Records"
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
    "key": "syncStatus",
    "label": "Sync Status",
    "type": "select",
    "options": [
      {
        "value": "READY",
        "label": "Ready"
      },
      {
        "value": "SYNCING",
        "label": "Syncing"
      },
      {
        "value": "DONE",
        "label": "Done"
      },
      {
        "value": "ERROR",
        "label": "Error"
      }
    ],
    "defaultValue": "READY"
  },
  {
    "key": "recordCount",
    "label": "Record Count"
  },
  {
    "key": "lastSync",
    "label": "Last Sync"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function SyncTableManagementPage() {
  return (
    <GenericCrudPage
      title="Table Migration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default SyncTableManagementPage
