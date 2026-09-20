import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/blocklist_ipService'

const columns = [
  {
    "key": "ipAddress",
    "label": "IP Address"
  },
  {
    "key": "reason",
    "label": "Reason"
  },
  {
    "key": "blockedBy",
    "label": "Blocked By"
  },
  {
    "key": "blockedOn",
    "label": "Blocked On"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "ipAddress",
    "label": "IP Address",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "reason",
    "label": "Reason",
    "required": true
  },
  {
    "key": "blockedBy",
    "label": "Blocked By"
  },
  {
    "key": "blockedOn",
    "label": "Blocked On"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "ALL"
  },
  {
    "key": "remarks",
    "label": "Remarks",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function BlocklistIPPage() {
  return (
    <GenericCrudPage
      title="Blocklist IP"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default BlocklistIPPage
