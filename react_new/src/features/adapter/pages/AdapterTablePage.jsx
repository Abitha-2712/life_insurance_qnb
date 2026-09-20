import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/adapterService'

const columns = [
  {
    "key": "adapterCode",
    "label": "Code"
  },
  {
    "key": "adapterName",
    "label": "Name"
  },
  {
    "key": "adapterType",
    "label": "Type"
  },
  {
    "key": "protocol",
    "label": "Protocol"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "adapterCode",
    "label": "Adapter Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "adapterName",
    "label": "Adapter Name",
    "required": true
  },
  {
    "key": "adapterType",
    "label": "Type",
    "type": "select",
    "options": [
      {
        "value": "ISO8583",
        "label": "ISO8583"
      },
      {
        "value": "REST",
        "label": "REST"
      },
      {
        "value": "SOAP",
        "label": "SOAP"
      },
      {
        "value": "MQ",
        "label": "MQ"
      }
    ]
  },
  {
    "key": "endpointUrl",
    "label": "Endpoint URL"
  },
  {
    "key": "protocol",
    "label": "Protocol",
    "type": "select",
    "options": [
      {
        "value": "HTTP",
        "label": "HTTP"
      },
      {
        "value": "HTTPS",
        "label": "HTTPS"
      },
      {
        "value": "TCP",
        "label": "TCP"
      },
      {
        "value": "MQ",
        "label": "MQ"
      }
    ],
    "defaultValue": "HTTP"
  },
  {
    "key": "timeoutMs",
    "label": "Timeout (ms)",
    "defaultValue": "30000"
  },
  {
    "key": "description",
    "label": "Description",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function AdapterTablePage() {
  return (
    <GenericCrudPage
      title="Adapter Table"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default AdapterTablePage
