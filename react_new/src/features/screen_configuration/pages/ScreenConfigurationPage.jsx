import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/screen_configurationService'

const columns = [
  {
    "key": "themeCode",
    "label": "Theme Code"
  },
  {
    "key": "themeName",
    "label": "Name"
  },
  {
    "key": "primaryColor",
    "label": "Primary"
  },
  {
    "key": "fontFamily",
    "label": "Font"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "themeCode",
    "label": "Theme Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "themeName",
    "label": "Theme Name (EN)",
    "required": true
  },
  {
    "key": "themeNameAr",
    "label": "Theme Name (AR)"
  },
  {
    "key": "primaryColor",
    "label": "Primary Color"
  },
  {
    "key": "secondaryColor",
    "label": "Secondary Color"
  },
  {
    "key": "fontFamily",
    "label": "Font Family"
  },
  {
    "key": "isDefault",
    "label": "Default Theme",
    "type": "select",
    "options": [
      {
        "value": "Y",
        "label": "Yes"
      },
      {
        "value": "N",
        "label": "No"
      }
    ],
    "defaultValue": "N"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function ScreenConfigurationPage() {
  return (
    <GenericCrudPage
      title="Theme Configuration"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ScreenConfigurationPage
