import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/widget_cfgService'

const columns = [
  {
    "key": "widgetCode",
    "label": "Code"
  },
  {
    "key": "widgetName",
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
    "key": "widgetCode",
    "label": "Widget Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "widgetName",
    "label": "Widget Name",
    "required": true
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

export default function WidgetConfigPage() {
  return (
    <GenericCrudPage
      title="Widget Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
