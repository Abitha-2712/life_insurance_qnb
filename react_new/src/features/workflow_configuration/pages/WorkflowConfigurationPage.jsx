import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/workflow_configurationService'

export default function WorkflowConfigurationPage() {
  return (
    <GenericCrudPage
      title="Workflow Configuration"
      service={service}
      columns={[
        { key: 'workflowCode', label: 'Code' },
        { key: 'workflowName', label: 'Name' },
        { key: 'steps', label: 'Steps' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'workflowCode', label: 'Code', required: true, lockOnEdit: true },
        { key: 'workflowName', label: 'Name', required: true },
        { key: 'steps', label: 'Steps', defaultValue: '1' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
