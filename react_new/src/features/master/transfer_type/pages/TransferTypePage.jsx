import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/transferTypeService'

const columns = [
  { key: 'transferTypeKey', label: 'Transfer Type Key' },
  { key: 'transferTypeValue', label: 'Transfer Type Value' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  {
    key: 'transferTypeKey',
    label: 'Transfer Type Key',
    required: true,
    maxLength: 200,
    placeholder: 'Enter Transfer Type Key',
    requiredMessage: 'Please enter Transfer Type Key',
  },
  {
    key: 'transferTypeValue',
    label: 'Transfer Type Value',
    required: true,
    maxLength: 200,
    placeholder: 'Enter Transfer Type Value',
    requiredMessage: 'Please enter Transfer Type Value',
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

export default function TransferTypePage() {
  return (
    <GenericCrudPage
      title="Transfer Types"
      entityLabel="Transfer Type"
      listTitle="List of Transfer Types"
      service={service}
      columns={columns}
      fields={fields}
      rowKey="id"
    />
  )
}
