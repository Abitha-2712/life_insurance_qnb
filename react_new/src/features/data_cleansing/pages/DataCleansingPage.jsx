import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/data_cleansingService'

const columns = [
  { key: 'customerId', label: 'Customer Id' },
  { key: 'customerName', label: 'Name' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'qidStatus', label: 'QID' },
  { key: 'accountStatus', label: 'Account' },
  { key: 'isBlocked', label: 'Blocked' },
  { key: 'channelId', label: 'Channel' },
]

const fields = [
  { key: 'customerId', label: 'Customer Id', required: true, lockOnEdit: true },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'blockReason', label: 'Block Reason' },
  { key: 'channelId', label: 'Channel' },
]

export default function DataCleansingPage() {
  return (
    <GenericCrudPage title="Data Cleansing" service={service} columns={columns} fields={fields} enableStatusFilter={false} />
  )
}
