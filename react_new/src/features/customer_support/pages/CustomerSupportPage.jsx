import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/customer_supportService'

const columns = [
  {
    "key": "customerId",
    "label": "CIF / Customer ID"
  },
  {
    "key": "customerName",
    "label": "Name"
  },
  {
    "key": "mobile",
    "label": "Mobile"
  },
  {
    "key": "segment",
    "label": "Segment"
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
    "label": "CIF / Customer ID",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "customerName",
    "label": "Customer Name",
    "required": true
  },
  {
    "key": "mobile",
    "label": "Mobile"
  },
  {
    "key": "email",
    "label": "Email"
  },
  {
    "key": "segment",
    "label": "Segment"
  },
  {
    "key": "actionType",
    "label": "Action Type",
    "type": "select",
    "options": [
      {
        "value": "VIEW",
        "label": "VIEW"
      },
      {
        "value": "SUPPORT",
        "label": "SUPPORT"
      },
      {
        "value": "ESCALATE",
        "label": "ESCALATE"
      }
    ],
    "defaultValue": "VIEW"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function CustomerSupportPage() {
  return (
    <GenericCrudPage
      title="Customer Support"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default CustomerSupportPage
