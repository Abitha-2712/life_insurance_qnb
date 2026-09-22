import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/dc_city_masterService'

const columns = [
  {
    "key": "cityCode",
    "label": "City Code"
  },
  {
    "key": "cityNameEnglish",
    "label": "City (EN)"
  },
  {
    "key": "cityNameArabic",
    "label": "City (AR)"
  },
  {
    "key": "countryCode",
    "label": "Country"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "cityCode",
    "label": "City Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "cityNameEnglish",
    "label": "City Name (English)",
    "required": true
  },
  {
    "key": "cityNameArabic",
    "label": "City Name (Arabic)"
  },
  {
    "key": "countryCode",
    "label": "Country Code",
    "defaultValue": "QA"
  },
  {
    "key": "region",
    "label": "Region"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function DCCityMasterPage() {
  return (
    <GenericCrudPage
      title="DC City Master"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default DCCityMasterPage
