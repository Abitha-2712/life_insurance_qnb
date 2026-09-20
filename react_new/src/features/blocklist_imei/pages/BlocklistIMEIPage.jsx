import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/blocklist_imeiService'

const columns = [
  {
    "key": "imei",
    "label": "IMEI"
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
    "key": "imei",
    "label": "IMEI",
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

function BlocklistIMEIPage() {
  return (
    <GenericCrudPage
      title="Blocklist IMEI"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default BlocklistIMEIPage
