import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/mccgService'

const columns = [
  {
    "key": "mccgCode",
    "label": "MCCG Code"
  },
  {
    "key": "mccgName",
    "label": "Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "mccgCode",
    "label": "MCCG Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "mccgName",
    "label": "Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function MccgPage() {
  return (
    <GenericCrudPage
      title="MCCG"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
