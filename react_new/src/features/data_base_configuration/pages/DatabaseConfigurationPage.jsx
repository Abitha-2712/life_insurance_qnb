import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/data_base_configurationService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'hostName', label: 'Host Name' },
  { key: 'dbType', label: 'Db Type' },
  { key: 'port', label: 'Port' },
  { key: 'database', label: 'Database' },
  { key: 'username', label: 'Username' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'hostName', label: 'Host Name' },
  { key: 'dbType', label: 'Db Type' },
  { key: 'port', label: 'Port' },
  { key: 'database', label: 'Database' },
  { key: 'username', label: 'Username' },
]

export default function DatabaseConfigurationPage() {
  return (
    <GenericCrudPage
      title="Database Configuration"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
