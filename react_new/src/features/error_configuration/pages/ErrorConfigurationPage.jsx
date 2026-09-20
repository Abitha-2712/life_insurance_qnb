import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/error_configurationService'

const columns = [
  { key: 'configCode', label: 'Config Code' },
  { key: 'description', label: 'Description' },
  { key: 'channel', label: 'Channel' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'configCode', label: 'Config Code', required: true, lockOnEdit: true },
  { key: 'description', label: 'Description', required: true },
  {
    key: 'channel',
    label: 'Channel',
    type: 'select',
    options: [
      { value: 'IB', label: 'Internet Banking' },
      { value: 'MB', label: 'Mobile Banking' },
      { value: 'ALL', label: 'All' },
    ],
    defaultValue: 'ALL',
  },
  { key: 'defaultSeverity', label: 'Default Severity', defaultValue: 'ERROR' },
  { key: 'status', label: 'Status', type: 'status' },
]

function ErrorConfigurationPage() {
  return (
    <GenericCrudPage
      title="Error Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ErrorConfigurationPage
