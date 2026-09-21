import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/domainService'

const columns = [
  { key: 'domainId', label: 'Domain Id' },
  { key: 'domainDesc', label: 'Domain Desc' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  {
    key: 'domainId',
    label: 'Domain',
    required: true,
    lockOnEdit: true,
    capsOnly: true,
    maxLength: 30,
    placeholder: 'Enter Domain',
    helperText: 'Caps only allowed',
    requiredMessage: 'Please enter Domain',
  },
  {
    key: 'domainDesc',
    label: 'Domain Description',
    required: true,
    maxLength: 30,
    placeholder: 'Enter Domain Description',
    requiredMessage: 'Please enter Domain Description',
  },
  {
    key: 'priority',
    label: 'Priority',
    required: true,
    digitsOnly: true,
    maxLength: 15,
    placeholder: 'Enter Priority',
    requiredMessage: 'Please enter Priority',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'switch',
    defaultValue: 'ACT',
    activeValue: 'ACT',
    inactiveValue: 'IAC',
    labelPosition: 'left',
  },
]

export default function DomainManagementPage() {
  return (
    <GenericCrudPage
      title="Domain Management"
      entityLabel="Domain"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
