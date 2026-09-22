import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/partner_onboardingService'

const columns = [
  { key: 'partnerCode', label: 'Code' },
  { key: 'partnerName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'partnerCode', label: 'Partner Code', required: true, lockOnEdit: true },
  { key: 'partnerName', label: 'Name (English)', required: true },
  { key: 'partnerNameAr', label: 'Name (Arabic)' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status', type: 'status' },
]

function PartnerOnboardingPage() {
  return (
    <GenericCrudPage
      title="Partner Listing"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default PartnerOnboardingPage
