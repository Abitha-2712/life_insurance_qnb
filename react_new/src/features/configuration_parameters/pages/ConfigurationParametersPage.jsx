import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/configuration_parametersService'

const columns = [
  {
    "key": "paramCode",
    "label": "Code"
  },
  {
    "key": "paramName",
    "label": "Name"
  },
  {
    "key": "paramValue",
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
    "key": "paramCode",
    "label": "Parameter Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "paramName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "paramNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "paramValue",
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

function ConfigurationParametersPage() {
  return (
    <GenericCrudPage
      title="Configuration Parameters"
      entityLabel="Configurations"
      listTitle="List of Field Configuration"
      service={service}
      columns={columns}
      fields={fields}
      totalLabel="Total Configurations"
      activeLabel="Active Configurations"
      inactiveLabel="Inactive Configurations"
      pdfFileName="configuration_parameters.pdf"
      excelFileName="configuration_parameters.xlsx"
    />
  )
}

export default ConfigurationParametersPage
