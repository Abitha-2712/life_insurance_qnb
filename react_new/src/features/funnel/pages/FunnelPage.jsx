import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/funnelService'

const columns = [
  {
    "key": "funnelCode",
    "label": "Code"
  },
  {
    "key": "funnelName",
    "label": "Name"
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "productCode",
    "label": "Product"
  },
  {
    "key": "conversionTarget",
    "label": "Target %"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "funnelCode",
    "label": "Funnel Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "funnelName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "funnelNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "MB"
  },
  {
    "key": "productCode",
    "label": "Product Code"
  },
  {
    "key": "stages",
    "label": "Stages (comma-separated)",
    "type": "textarea"
  },
  {
    "key": "conversionTarget",
    "label": "Conversion Target %"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function FunnelPage() {
  return (
    <GenericCrudPage
      title="Funnel"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default FunnelPage
