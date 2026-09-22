import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/mq_configurationService'

const columns = [
  {
    "key": "queueName",
    "label": "Queue"
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "queueName",
    "label": "Queue Name",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "channel",
    "label": "Channel",
    "required": true
  },
  {
    "key": "host",
    "label": "Host"
  },
  {
    "key": "port",
    "label": "Port"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function MqConfigurationPage() {
  return (
    <GenericCrudPage
      title="MQ Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
