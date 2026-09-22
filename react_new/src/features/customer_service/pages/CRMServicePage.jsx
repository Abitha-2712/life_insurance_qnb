import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/customer_serviceService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'code', label: 'Code' },
  { key: 'serviceName', label: 'Service Name' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'department', label: 'Department' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'code', label: 'Code' },
  { key: 'serviceName', label: 'Service Name' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'department', label: 'Department' },
]

export default function CRMServicePage() {
  return (
    <GenericCrudPage
      title="CRM Service"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
