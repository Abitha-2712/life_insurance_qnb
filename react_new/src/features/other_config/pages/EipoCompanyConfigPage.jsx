import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/eipoService'

/** Flutter eipo-company-config/get-all → data.eipoList */
const columns = [
  { key: 'companyId', label: 'Company Id' },
  { key: 'companyNameEn', label: 'Company Name (EN)' },
  { key: 'companyNameAr', label: 'Company Name (AR)' },
  { key: 'unitPrice', label: 'Unit Price' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'companyId', label: 'Company Id', required: true, lockOnEdit: true },
  { key: 'companyNameEn', label: 'Company Name (EN)', required: true },
  { key: 'companyNameAr', label: 'Company Name (AR)' },
  { key: 'minShares', label: 'Min Shares' },
  { key: 'maxShares', label: 'Max Shares' },
  { key: 'unitPrice', label: 'Unit Price' },
  { key: 'status', label: 'Status', type: 'status' },
]

export default function EipoCompanyConfigPage() {
  return (
    <GenericCrudPage title="eIPO Company Configuration" service={service} columns={columns} fields={fields} />
  )
}
