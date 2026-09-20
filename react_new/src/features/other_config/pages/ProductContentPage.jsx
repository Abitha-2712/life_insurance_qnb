import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/product_contentService'

const columns = [
  {
    "key": "productCode",
    "label": "Product Code"
  },
  {
    "key": "titleEn",
    "label": "Title (EN)"
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
    "key": "titleEn",
    "label": "Title (English)",
    "required": true
  },
  {
    "key": "titleAr",
    "label": "Title (Arabic)"
  },
  {
    "key": "content",
    "label": "Content",
    "type": "textarea"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function ProductContentPage() {
  return (
    <GenericCrudPage
      title="Product Content Management"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
