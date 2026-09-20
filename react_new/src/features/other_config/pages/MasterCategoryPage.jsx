import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/master_categoryService'

const columns = [
  {
    "key": "categoryCode",
    "label": "Category Code"
  },
  {
    "key": "categoryName",
    "label": "Category Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "categoryCode",
    "label": "Category Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "categoryName",
    "label": "Category Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function MasterCategoryPage() {
  return (
    <GenericCrudPage
      title="Master Category"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
