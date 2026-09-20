import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/accountTypeService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'applicationType', label: 'Application Type' },
  { key: 'accountType', label: 'Account Type' },
  { key: 'cardIssuance', label: 'Card Issuance' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'applicationType', label: 'Application Type' },
  { key: 'accountType', label: 'Account Type' },
  { key: 'cardIssuance', label: 'Card Issuance' },
]

export default function AccountTypePage() {
  return (
    <GenericCrudPage
      title="Account Type"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
