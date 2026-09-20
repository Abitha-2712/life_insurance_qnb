import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/FAQ_managementService'

const columns = [
  { key: 'faqId', label: 'Faq Id' },
  { key: 'englishQuestion', label: 'English Question' },
  { key: 'englishResponse', label: 'English Response' },
  { key: 'arabicQuestion', label: 'Arabic Question' },
  { key: 'arabicResponse', label: 'Arabic Response' },
  { key: 'startDate', label: 'Start Date' },
]

const fields = [
  { key: 'faqId', label: 'Faq Id', required: true },
  { key: 'englishQuestion', label: 'English Question' },
  { key: 'englishResponse', label: 'English Response' },
  { key: 'arabicQuestion', label: 'Arabic Question' },
  { key: 'arabicResponse', label: 'Arabic Response' },
  { key: 'startDate', label: 'Start Date' },
]

export default function FAQManagementPage() {
  return (
    <GenericCrudPage
      title="FAQ Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
