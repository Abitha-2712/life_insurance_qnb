import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/connectivity_hubService'

const columns = [
  {
    "key": "hubCode",
    "label": "Hub Code"
  },
  {
    "key": "hubName",
    "label": "Hub Name"
  },
  {
    "key": "endpoint",
    "label": "Endpoint"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "hubCode",
    "label": "Hub Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "hubName",
    "label": "Hub Name",
    "required": true
  },
  {
    "key": "endpoint",
    "label": "Endpoint URL"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function ConnectivityHubPage() {
  return (
    <GenericCrudPage
      title="Connectivity Hub"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
