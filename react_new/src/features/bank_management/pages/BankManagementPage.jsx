import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/bank_managementService'

const columns = [
  { key: 'bankId', label: 'Bank Id' },
  { key: 'bicCode', label: 'Bic Code' },
  { key: 'bankNameEn', label: 'Bank Name En' },
  { key: 'bankNameAr', label: 'Bank Name Ar' },
  { key: 'status', label: 'Status', statusChip: true },
  { key: 'fawranStatus', label: 'Fawran Status' },
]

const fields = [
  { key: 'bankId', label: 'Bank Id', required: true },
  { key: 'bicCode', label: 'Bic Code' },
  { key: 'bankNameEn', label: 'Bank Name En' },
  { key: 'bankNameAr', label: 'Bank Name Ar' },
  { key: 'status', label: 'Status' },
  { key: 'fawranStatus', label: 'Fawran Status' },
]

export default function BankManagementPage() {
  return (
    <GenericCrudPage
      title="Bank Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
