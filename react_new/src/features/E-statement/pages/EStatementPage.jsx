import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/E-statementService'

const columns = [
  {
    "key": "templateCode",
    "label": "Template"
  },
  {
    "key": "templateName",
    "label": "Name"
  },
  {
    "key": "productCode",
    "label": "Product"
  },
  {
    "key": "format",
    "label": "Format"
  },
  {
    "key": "frequency",
    "label": "Frequency"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "templateCode",
    "label": "Template Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "templateName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "templateNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "productCode",
    "label": "Product Code"
  },
  {
    "key": "format",
    "label": "Format",
    "type": "select",
    "options": [
      {
        "value": "PDF",
        "label": "PDF"
      },
      {
        "value": "CSV",
        "label": "CSV"
      },
      {
        "value": "XLS",
        "label": "XLS"
      }
    ],
    "defaultValue": "PDF"
  },
  {
    "key": "frequency",
    "label": "Frequency",
    "type": "select",
    "options": [
      {
        "value": "DAILY",
        "label": "DAILY"
      },
      {
        "value": "WEEKLY",
        "label": "WEEKLY"
      },
      {
        "value": "MONTHLY",
        "label": "MONTHLY"
      },
      {
        "value": "YEARLY",
        "label": "YEARLY"
      }
    ],
    "defaultValue": "MONTHLY"
  },
  {
    "key": "language",
    "label": "Language",
    "defaultValue": "EN"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function EStatementPage() {
  return (
    <GenericCrudPage
      title="E-Statement"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default EStatementPage
