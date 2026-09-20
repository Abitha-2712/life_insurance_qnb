import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/push_notificationService'

export default function PushNotificationPage() {
  return (
    <GenericCrudPage
      title="Push Notification"
      service={service}
      columns={[
        { key: 'customerId', label: 'Customer ID' },
        { key: 'deviceToken', label: 'Device Token' },
        { key: 'platform', label: 'Platform' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'customerId', label: 'Customer ID', required: true, lockOnEdit: true },
        { key: 'deviceToken', label: 'Device Token' },
        {
          key: 'platform',
          label: 'Platform',
          type: 'select',
          options: [
            { value: 'Android', label: 'Android' },
            { value: 'iOS', label: 'iOS' },
            { value: 'Web', label: 'Web' },
          ],
        },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
