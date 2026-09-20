import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/rtp_account_typeService'

const columns = [
  {
    "key": "accountTypeCode",
    "label": "Type Code"
  },
  {
    "key": "accountTypeName",
    "label": "Type Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "accountTypeCode",
    "label": "Account Type Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "accountTypeName",
    "label": "Account Type Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function RtpAccountTypePage() {
  return (
    <GenericCrudPage
      title="RTP Account Type"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
