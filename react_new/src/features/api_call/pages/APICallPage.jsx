import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/api_callService'

const columns = [
  {
    "key": "apiCode",
    "label": "Code"
  },
  {
    "key": "apiName",
    "label": "Name"
  },
  {
    "key": "httpMethod",
    "label": "Method"
  },
  {
    "key": "endpoint",
    "label": "Endpoint"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "apiCode",
    "label": "API Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "apiName",
    "label": "API Name",
    "required": true
  },
  {
    "key": "httpMethod",
    "label": "HTTP Method",
    "type": "select",
    "options": [
      {
        "value": "GET",
        "label": "GET"
      },
      {
        "value": "POST",
        "label": "POST"
      },
      {
        "value": "PUT",
        "label": "PUT"
      },
      {
        "value": "DELETE",
        "label": "DELETE"
      }
    ],
    "defaultValue": "POST"
  },
  {
    "key": "endpoint",
    "label": "Endpoint Path",
    "required": true
  },
  {
    "key": "serviceId",
    "label": "Service ID"
  },
  {
    "key": "requestSample",
    "label": "Request Sample",
    "type": "textarea"
  },
  {
    "key": "responseSample",
    "label": "Response Sample",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function APICallPage() {
  return (
    <GenericCrudPage
      title="API Call"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default APICallPage
