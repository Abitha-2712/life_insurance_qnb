import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/channelService'

const columns = [
  { key: 'channelId', label: 'Channel Id' },
  { key: 'description', label: 'Description' },
  { key: 'channelDesc', label: 'Channel Desc' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'channelId', label: 'Channel Id', required: true },
  { key: 'description', label: 'Description' },
  { key: 'channelDesc', label: 'Channel Desc' },
  { key: 'status', label: 'Status' },
]

export default function ChannelTablePage() {
  return (
    <GenericCrudPage
      title="Channel"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
