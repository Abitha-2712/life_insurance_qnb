import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/instant_financeService'

const columns = [
  {
    "key": "productCode",
    "label": "Product Code"
  },
  {
    "key": "productName",
    "label": "Name"
  },
  {
    "key": "maxAmount",
    "label": "Max Amount"
  },
  {
    "key": "profitRate",
    "label": "Profit %"
  },
  {
    "key": "segmentCode",
    "label": "Segment"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "productCode",
    "label": "Product Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "productName",
    "label": "Product Name (EN)",
    "required": true
  },
  {
    "key": "productNameAr",
    "label": "Product Name (AR)"
  },
  {
    "key": "minAmount",
    "label": "Min Amount"
  },
  {
    "key": "maxAmount",
    "label": "Max Amount",
    "required": true
  },
  {
    "key": "maxTenure",
    "label": "Max Tenure (Months)"
  },
  {
    "key": "profitRate",
    "label": "Profit Rate %"
  },
  {
    "key": "segmentCode",
    "label": "Segment Code"
  },
  {
    "key": "currency",
    "label": "Currency",
    "defaultValue": "QAR"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function InstantFinancePage() {
  return (
    <GenericCrudPage
      title="Instant Finance"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default InstantFinancePage
