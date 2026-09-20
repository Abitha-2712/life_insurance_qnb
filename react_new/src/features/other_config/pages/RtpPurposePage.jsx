import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/rtp_purposeService'

const columns = [
  {
    "key": "purposeCode",
    "label": "Purpose Code"
  },
  {
    "key": "purposeName",
    "label": "Purpose Name"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "purposeCode",
    "label": "Purpose Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "purposeName",
    "label": "Purpose Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function RtpPurposePage() {
  return (
    <GenericCrudPage
      title="RTP Transfer Purpose"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
