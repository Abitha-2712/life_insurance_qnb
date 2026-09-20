import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/other_configService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'classCode', label: 'Class Code' },
  { key: 'englishDescription', label: 'English Description' },
  { key: 'accountType', label: 'Account Type' },
  { key: 'arabicDescription', label: 'Arabic Description' },
  { key: 'currency', label: 'Currency' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'classCode', label: 'Class Code' },
  { key: 'englishDescription', label: 'English Description' },
  { key: 'accountType', label: 'Account Type' },
  { key: 'arabicDescription', label: 'Arabic Description' },
  { key: 'currency', label: 'Currency' },
]

export default function OtherConfigurationPage() {
  return (
    <GenericCrudPage
      title="Other Configuration"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
