import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/termsDisclaimerService'

const columns = [
  { key: 'disclaimerCode', label: 'Code' },
  { key: 'titleEn', label: 'Title (EN)' },
  { key: 'channel', label: 'Channel' },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'disclaimerCode', label: 'Code', required: true, lockOnEdit: true },
  { key: 'titleEn', label: 'Title (EN)', required: true },
  { key: 'titleAr', label: 'Title (AR)' },
  { key: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
  { key: 'contentAr', label: 'Content (AR)', type: 'textarea' },
  {
    key: 'channel',
    label: 'Channel',
    type: 'select',
    options: [
      { value: 'MB', label: 'Mobile Banking' },
      { value: 'IB', label: 'Internet Banking' },
      { value: 'ALL', label: 'All' },
    ],
    defaultValue: 'ALL',
  },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status', type: 'status' },
]

/** Flutter TermsConditionsDisclaimerPage */
export default function TermsDisclaimerPage() {
  return (
    <GenericCrudPage
      title="Terms & Conditions Disclaimer"
      className="terms-disclaimer-page"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
