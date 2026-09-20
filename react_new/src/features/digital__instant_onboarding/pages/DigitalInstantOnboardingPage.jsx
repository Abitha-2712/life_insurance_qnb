import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/digital__instant_onboardingService'

const columns = [
  { key: 'stateId', label: 'State Id' },
  { key: 'title', label: 'Title' },
  { key: 'customerId', label: 'Customer Id' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'qatarIdNo', label: 'Qatar Id No' },
  { key: 'onboardingStatus', label: 'Onboarding Status', statusChip: true },
]

const fields = [
  { key: 'stateId', label: 'State Id', required: true },
  { key: 'title', label: 'Title' },
  { key: 'customerId', label: 'Customer Id' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'qatarIdNo', label: 'Qatar Id No' },
  { key: 'onboardingStatus', label: 'Onboarding Status' },
]

export default function DigitalInstantOnboardingPage() {
  return (
    <GenericCrudPage
      title="Digital Instant Onboarding"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
