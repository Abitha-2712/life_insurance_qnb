import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/favoriteService'

const columns = [
  {
    "key": "favoriteCode",
    "label": "Code"
  },
  {
    "key": "favoriteName",
    "label": "Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "favoriteCode",
    "label": "Favorite Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "favoriteName",
    "label": "Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function FavoritePage() {
  return (
    <GenericCrudPage
      title="Favorite"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
