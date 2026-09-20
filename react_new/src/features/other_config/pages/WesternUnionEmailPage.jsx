import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/western_union_emailService'

const columns = [
  {
    "key": "email",
    "label": "Email"
  },
  {
    "key": "role",
    "label": "Role"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "email",
    "label": "Email",
    "required": true
  },
  {
    "key": "role",
    "label": "Role"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function WesternUnionEmailPage() {
  return (
    <GenericCrudPage
      title="Western Union Email"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
