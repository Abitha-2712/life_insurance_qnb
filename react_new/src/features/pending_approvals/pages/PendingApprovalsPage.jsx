import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/pending_approvalsService'

const columns = [
  {
    "key": "requestId",
    "label": "Request ID"
  },
  {
    "key": "requestType",
    "label": "Type"
  },
  {
    "key": "moduleName",
    "label": "Module"
  },
  {
    "key": "requestedBy",
    "label": "Requested By"
  },
  {
    "key": "requestedOn",
    "label": "Requested On"
  },
  {
    "key": "approvalStatus",
    "label": "Approval"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "requestId",
    "label": "Request ID",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "requestType",
    "label": "Request Type",
    "type": "select",
    "required": true,
    "options": [
      {
        "value": "USER",
        "label": "User"
      },
      {
        "value": "ROLE",
        "label": "Role"
      },
      {
        "value": "CONFIG",
        "label": "Config"
      },
      {
        "value": "PRODUCT",
        "label": "Product"
      },
      {
        "value": "OTHER",
        "label": "Other"
      }
    ],
    "defaultValue": "CONFIG"
  },
  {
    "key": "moduleName",
    "label": "Module"
  },
  {
    "key": "requestedBy",
    "label": "Requested By"
  },
  {
    "key": "requestedOn",
    "label": "Requested On"
  },
  {
    "key": "action",
    "label": "Action",
    "type": "select",
    "options": [
      {
        "value": "CREATE",
        "label": "Create"
      },
      {
        "value": "UPDATE",
        "label": "Update"
      },
      {
        "value": "DELETE",
        "label": "Delete"
      },
      {
        "value": "APPROVE",
        "label": "Approve"
      },
      {
        "value": "REJECT",
        "label": "Reject"
      }
    ]
  },
  {
    "key": "approvalStatus",
    "label": "Approval Status",
    "type": "select",
    "options": [
      {
        "value": "PENDING",
        "label": "Pending"
      },
      {
        "value": "APPROVED",
        "label": "Approved"
      },
      {
        "value": "REJECTED",
        "label": "Rejected"
      }
    ],
    "defaultValue": "PENDING"
  },
  {
    "key": "comments",
    "label": "Comments",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function PendingApprovalsPage() {
  return (
    <GenericCrudPage
      title="Pending Approvals"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default PendingApprovalsPage
