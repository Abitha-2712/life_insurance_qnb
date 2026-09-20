import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/sectorService'

const columns = [
  {
    "key": "sectorCode",
    "label": "Sector Code"
  },
  {
    "key": "sectorName",
    "label": "Sector Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "sectorCode",
    "label": "Sector Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "sectorName",
    "label": "Sector Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function SectorPage() {
  return (
    <GenericCrudPage
      title="Sector"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
