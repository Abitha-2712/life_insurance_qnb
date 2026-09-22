import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/beneficiaryService'

const columns = [
  {
    "key": "beneficiaryType",
    "label": "Type"
  },
  {
    "key": "coolingPeriodHours",
    "label": "Cooling (hrs)"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "beneficiaryType",
    "label": "Beneficiary Type",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "coolingPeriodHours",
    "label": "Cooling Period (Hours)",
    "required": true
  },
  {
    "key": "maxBeneficiaries",
    "label": "Max Beneficiaries"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function BeneficiaryConfigPage() {
  return (
    <GenericCrudPage
      title="Beneficiary Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
