import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/transfer_configService'

const columns = [
  { key: 'transferType', label: 'Type' },
  { key: 'channel', label: 'Channel' },
  { key: 'limitAmount', label: 'Limit' },
  { key: 'currency', label: 'Currency' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'transferType', label: 'Transfer Type', required: true, lockOnEdit: true },
  {
    key: 'channel',
    label: 'Channel',
    type: 'select',
    options: [
      { value: 'IB', label: 'Internet Banking' },
      { value: 'MB', label: 'Mobile Banking' },
      { value: 'ALL', label: 'All' },
    ],
    defaultValue: 'ALL',
  },
  { key: 'segmentCode', label: 'Segment Code' },
  { key: 'limitAmount', label: 'Limit Amount', required: true },
  { key: 'dailyLimit', label: 'Daily Limit' },
  { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
  { key: 'status', label: 'Status', type: 'status' },
]

function TransferControlPage() {
  return (
    <GenericCrudPage
      title="Transfer Control"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default TransferControlPage
