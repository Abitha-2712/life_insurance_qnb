import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/productService'

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
    "key": "domainCode",
    "label": "Domain"
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
    "key": "productCode",
    "label": "Product Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "productName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "productNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "domainCode",
    "label": "Domain Code"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "ALL"
  },
  {
    "key": "sequence",
    "label": "Sequence"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function ProductManagementPage() {
  return (
    <GenericCrudPage
      title="Product Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ProductManagementPage
