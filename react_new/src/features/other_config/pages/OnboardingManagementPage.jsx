import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/onboarding_mgmtService'

/** Flutter customerOnboarding/getAll → data.customers */
const columns = [
  { key: 'customerId', label: 'Customer Id' },
  { key: 'mobileNumber', label: 'Mobile' },
  { key: 'qatarIdNo', label: 'QID' },
  { key: 'onboardingStatus', label: 'Status', statusChip: true },
  { key: 'currentStep', label: 'Current Step' },
]

const fields = [
  { key: 'customerId', label: 'Customer Id', required: true, lockOnEdit: true },
  { key: 'mobileNumber', label: 'Mobile' },
  { key: 'qatarIdNo', label: 'QID' },
  { key: 'onboardingStatus', label: 'Status', type: 'status' },
  { key: 'currentStep', label: 'Current Step' },
]

export default function OnboardingManagementPage() {
  return (
    <GenericCrudPage
      title="Onboarding Management"
      service={service}
      columns={columns}
      fields={fields}
      statusKey="onboardingStatus"
    />
  )
}
