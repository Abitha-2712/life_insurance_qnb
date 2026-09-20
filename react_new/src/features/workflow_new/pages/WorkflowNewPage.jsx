import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/workflow_newService'

export default function WorkflowNewPage() {
  return (
    <GenericCrudPage
      title="Pending Approvals"
      service={service}
      columns={[
        { key: 'requestId', label: 'Request ID' },
        { key: 'requestType', label: 'Type' },
        { key: 'requestedBy', label: 'Requested By' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'requestId', label: 'Request ID', required: true, lockOnEdit: true },
        { key: 'requestType', label: 'Type', required: true },
        { key: 'requestedBy', label: 'Requested By' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'Y', label: 'Active' },
            { value: 'N', label: 'Inactive' },
          ],
        },
      ]}
    />
  )
}
