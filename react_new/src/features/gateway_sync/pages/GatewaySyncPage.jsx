import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/gateway_syncService'

const columns = [
  { key: 'syncTable', label: 'Table' },
  { key: 'migrationStatus', label: 'Migration' },
  { key: 'syncStatus', label: 'Sync' },
  { key: 'refreshStatus', label: 'Refresh' },
  { key: 'migrationDate', label: 'Migrated' },
  { key: 'syncDate', label: 'Synced' },
]

const fields = [
  { key: 'syncTable', label: 'Sync Table', required: true, lockOnEdit: true },
  { key: 'migrationStatus', label: 'Migration Status' },
  { key: 'syncStatus', label: 'Sync Status' },
  { key: 'keyPrefix', label: 'Key Prefix' },
  { key: 'keyPattern', label: 'Key Pattern' },
]

export default function GatewaySyncPage() {
  return (
    <GenericCrudPage title="Gateway Sync" service={service} columns={columns} fields={fields} enableStatusFilter={false} />
  )
}
