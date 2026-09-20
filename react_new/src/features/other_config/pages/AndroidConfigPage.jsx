import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/android_configService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'fcmMode', label: 'Fcm Mode' },
  { key: 'fcmProjectId', label: 'Fcm Project Id' },
  { key: 'fcmGoogleCredsJson', label: 'Fcm Google Creds Json' },
  { key: 'jpushAppKey', label: 'Jpush App Key' },
  { key: 'jpushMasterSecret', label: 'Jpush Master Secret' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'fcmMode', label: 'Fcm Mode' },
  { key: 'fcmProjectId', label: 'Fcm Project Id' },
  { key: 'fcmGoogleCredsJson', label: 'Fcm Google Creds Json' },
  { key: 'jpushAppKey', label: 'Jpush App Key' },
  { key: 'jpushMasterSecret', label: 'Jpush Master Secret' },
]

export default function AndroidConfigPage() {
  return (
    <GenericCrudPage
      title="Android Config"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
