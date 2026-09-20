import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/unitService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'countryCode', label: 'Country Code' },
  { key: 'description', label: 'Description' },
  { key: 'unitId', label: 'Unit Id' },
  { key: 'color', label: 'Color' },
  { key: 'unitDesc', label: 'Unit Desc' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'countryCode', label: 'Country Code' },
  { key: 'description', label: 'Description' },
  { key: 'unitId', label: 'Unit Id' },
  { key: 'color', label: 'Color' },
  { key: 'unitDesc', label: 'Unit Desc' },
]

export default function UnitTablePage() {
  return (
    <GenericCrudPage
      title="Unit"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
