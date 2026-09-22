import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/groupService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'segmentCode', label: 'Segment Code' },
  { key: 'grpName', label: 'Grp Name' },
  { key: 'remarks', label: 'Remarks' },
  { key: 'unitId', label: 'Unit Id' },
  { key: 'unitDesc', label: 'Unit Desc' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'segmentCode', label: 'Segment Code' },
  { key: 'grpName', label: 'Grp Name' },
  { key: 'remarks', label: 'Remarks' },
  { key: 'unitId', label: 'Unit Id' },
  { key: 'unitDesc', label: 'Unit Desc' },
]

export default function GroupManagementPage() {
  return (
    <GenericCrudPage
      title="Group Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
