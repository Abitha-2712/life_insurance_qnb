import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/force_update_configurationService'

const columns = [
  { key: 'platform', label: 'Platform' },
  { key: 'version', label: 'Min Version' },
  { key: 'latestVersion', label: 'Latest' },
  { key: 'forceUpdate', label: 'Force' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  {
    key: 'platform',
    label: 'Platform',
    required: true,
    lockOnEdit: true,
    type: 'select',
    options: [
      { value: 'Android', label: 'Android' },
      { value: 'iOS', label: 'iOS' },
      { value: 'Huawei', label: 'Huawei' },
    ],
  },
  { key: 'version', label: 'Minimum Version', required: true },
  { key: 'latestVersion', label: 'Latest Version' },
  { key: 'storeUrl', label: 'Store URL' },
  { key: 'messageEn', label: 'Message (English)', type: 'textarea' },
  { key: 'messageAr', label: 'Message (Arabic)', type: 'textarea' },
  { key: 'forceUpdate', label: 'Force Update', type: 'status' },
  { key: 'status', label: 'Status', type: 'status' },
]

function ForceUpdatePage() {
  return (
    <GenericCrudPage
      title="Force Update"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ForceUpdatePage
