import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/profile_controlService'

const columns = [
  {
    "key": "profileCode",
    "label": "Code"
  },
  {
    "key": "profileName",
    "label": "Name"
  },
  {
    "key": "segmentCode",
    "label": "Segment"
  },
  {
    "key": "maxDevices",
    "label": "Max Devices"
  },
  {
    "key": "status",
    "label": "Status",
    "statusChip": true
  }
]

const fields = [
  {
    "key": "profileCode",
    "label": "Profile Code",
    "required": true,
    "lockOnEdit": true
  },
  {
    "key": "profileName",
    "label": "Name (English)",
    "required": true
  },
  {
    "key": "profileNameAr",
    "label": "Name (Arabic)"
  },
  {
    "key": "segmentCode",
    "label": "Segment Code"
  },
  {
    "key": "channel",
    "label": "Channel",
    "defaultValue": "ALL"
  },
  {
    "key": "maxDevices",
    "label": "Max Devices",
    "defaultValue": "3"
  },
  {
    "key": "allowBiometric",
    "label": "Allow Biometric",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "allowNickname",
    "label": "Allow Nickname",
    "type": "status",
    "defaultValue": "Y"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "status"
  }
]

function ProfileControlPage() {
  return (
    <GenericCrudPage
      title="Profile Control"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ProfileControlPage
