import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/direct_remittance_typeService'

const columns = [
  {
    "key": "typeCode",
    "label": "Type Code"
  },
  {
    "key": "typeName",
    "label": "Type Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "typeCode",
    "label": "Type Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "typeName",
    "label": "Type Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function DirectRemittanceTypePage() {
  return (
    <GenericCrudPage
      title="Direct Remittance Type"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
