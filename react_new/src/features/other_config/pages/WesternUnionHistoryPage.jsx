import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/western_union_historyService'

const columns = [
  {
    "key": "referenceNo",
    "label": "Reference"
  },
  {
    "key": "amount",
    "label": "Amount"
  },
  {
    "key": "currency",
    "label": "Currency"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "referenceNo",
    "label": "Reference No",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "amount",
    "label": "Amount",
    "required": true
  },
  {
    "key": "currency",
    "label": "Currency",
    "defaultValue": "QAR"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function WesternUnionHistoryPage() {
  return (
    <GenericCrudPage
      title="Western Union History"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
