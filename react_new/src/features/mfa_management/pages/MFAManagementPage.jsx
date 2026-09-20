import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/mfa_managementService'

const columns = [
  { key: 'mfaId', label: 'Mfa Id' },
  { key: 'mfaName', label: 'Mfa Name' },
  { key: 'mfaType', label: 'Mfa Type' },
  { key: 'mfaFailCount', label: 'Mfa Fail Count' },
  { key: 'effectiveFrom', label: 'Effective From' },
  { key: 'effectiveTo', label: 'Effective To' },
]

const fields = [
  { key: 'mfaId', label: 'Mfa Id', required: true },
  { key: 'mfaName', label: 'Mfa Name' },
  { key: 'mfaType', label: 'Mfa Type' },
  { key: 'mfaFailCount', label: 'Mfa Fail Count' },
  { key: 'effectiveFrom', label: 'Effective From' },
  { key: 'effectiveTo', label: 'Effective To' },
]

export default function MFAManagementPage() {
  return (
    <GenericCrudPage
      title="MFA Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
