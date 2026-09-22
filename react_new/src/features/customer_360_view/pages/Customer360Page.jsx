import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/customer_360_viewService'

const columns = [
  {
    "key": "customerId",
    "label": "Customer ID"
  },
  {
    "key": "customerName",
    "label": "Name"
  },
  {
    "key": "cif",
    "label": "CIF"
  },
  {
    "key": "mobile",
    "label": "Mobile"
  },
  {
    "key": "blockStatus",
    "label": "Block Status"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "customerId",
    "label": "Customer ID",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "customerName",
    "label": "Customer Name",
    "required": true
  },
  {
    "key": "cif",
    "label": "CIF"
  },
  {
    "key": "mobile",
    "label": "Mobile"
  },
  {
    "key": "blockStatus",
    "label": "Block Status",
    "type": "select",
    "options": [
      {
        "value": "ACTIVE",
        "label": "Active"
      },
      {
        "value": "BLOCKED",
        "label": "Blocked"
      },
      {
        "value": "PENDING",
        "label": "Pending"
      }
    ],
    "defaultValue": "ACTIVE"
  },
  {
    "key": "blockReason",
    "label": "Block Reason",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function Customer360Page() {
  return (
    <GenericCrudPage
      title="Block / Unblock Users"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default Customer360Page
