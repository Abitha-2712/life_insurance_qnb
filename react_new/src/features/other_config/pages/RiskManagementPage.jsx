import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/riskService'

const columns = [
  {
    "key": "riskCode",
    "label": "Risk Code"
  },
  {
    "key": "riskName",
    "label": "Name"
  },
  {
    "key": "threshold",
    "label": "Threshold"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "riskCode",
    "label": "Risk Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "riskName",
    "label": "Name",
    "required": true
  },
  {
    "key": "threshold",
    "label": "Threshold"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function RiskManagementPage() {
  return (
    <GenericCrudPage
      title="Risk Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
