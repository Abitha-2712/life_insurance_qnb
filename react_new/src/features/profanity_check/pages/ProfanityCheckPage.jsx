import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/profanity_checkService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'profanityWordsEn', label: 'Profanity Words En' },
  { key: 'profanityWordsAr', label: 'Profanity Words Ar' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'profanityWordsEn', label: 'Profanity Words En' },
  { key: 'profanityWordsAr', label: 'Profanity Words Ar' },
  { key: 'status', label: 'Status' },
]

export default function ProfanityCheckPage() {
  return (
    <GenericCrudPage
      title="Profanity Check"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
