import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/branchLocatorService'

export default function BranchLocatorPage() {
  return (
    <GenericCrudPage
      title="Branch Locator"
      service={service}
      columns={[
        { key: 'branchCode', label: 'Branch Code' },
        { key: 'branchName', label: 'Branch Name' },
        { key: 'city', label: 'City' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'branchCode', label: 'Branch Code', required: true, lockOnEdit: true },
        { key: 'branchName', label: 'Branch Name', required: true },
        { key: 'city', label: 'City' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
