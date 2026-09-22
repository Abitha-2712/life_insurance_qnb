import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/customer_jounreyService'

const columns = [
  {
    "key": "journeyCode",
    "label": "Code"
  },
  {
    "key": "journeyName",
    "label": "Name"
  },
  {
    "key": "channel",
    "label": "Channel"
  },
  {
    "key": "segmentCode",
    "label": "Segment"
  },
  {
    "key": "stepCount",
    "label": "Steps"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "journeyCode",
    "label": "Journey Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "journeyName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "journeyNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "MB"
  },
  {
    "key": "segmentCode",
    "label": "Segment Code"
  },
  {
    "key": "stepCount",
    "label": "Step Count"
  },
  {
    "key": "sequence",
    "label": "Sequence"
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

function CustomerJourneyPage() {
  return (
    <GenericCrudPage
      title="Customer Journey"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default CustomerJourneyPage
