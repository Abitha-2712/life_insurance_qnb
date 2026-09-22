import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/sms_configurationService'

const columns = [
  { key: 'configId', label: 'Config Id' },
  { key: 'channelName', label: 'Channel Name' },
  { key: 'otpLength', label: 'Otp Length' },
  { key: 'otpExpirySecond', label: 'Otp Expiry Second' },
  { key: 'maxInvalidSession', label: 'Max Invalid Session' },
  { key: 'maxInvalidUser', label: 'Max Invalid User' },
]

const fields = [
  { key: 'configId', label: 'Config Id', required: true },
  { key: 'channelName', label: 'Channel Name' },
  { key: 'otpLength', label: 'Otp Length' },
  { key: 'otpExpirySecond', label: 'Otp Expiry Second' },
  { key: 'maxInvalidSession', label: 'Max Invalid Session' },
  { key: 'maxInvalidUser', label: 'Max Invalid User' },
]

export default function SMSConfigurationPage() {
  return (
    <GenericCrudPage
      title="SMS Configuration"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
