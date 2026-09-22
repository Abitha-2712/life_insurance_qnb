import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/Parameter_maintenanceService'

const columns = [
  {
    "key": "parameterCode",
    "label": "Code"
  },
  {
    "key": "parameterName",
    "label": "Name"
  },
  {
    "key": "parameterValue",
    "label": "Value"
  },
  {
    "key": "module",
    "label": "Module"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "parameterCode",
    "label": "Parameter Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "parameterName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "parameterNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "parameterValue",
    "label": "Value",
    "required": true
  },
  {
    "key": "module",
    "label": "Module"
  },
  {
    "key": "dataType",
    "label": "Data Type",
    "type": "select",
    "options": [
      {
        "value": "STRING",
        "label": "STRING"
      },
      {
        "value": "NUMBER",
        "label": "NUMBER"
      },
      {
        "value": "BOOLEAN",
        "label": "BOOLEAN"
      },
      {
        "value": "JSON",
        "label": "JSON"
      }
    ],
    "defaultValue": "STRING"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "ALL"
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

function ParameterMaintenancePage() {
  return (
    <GenericCrudPage
      title="Parameter Maintenance"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ParameterMaintenancePage
