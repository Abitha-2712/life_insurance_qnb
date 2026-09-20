import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/finance_calculatorService'

const columns = [
  { key: 'segmentId', label: 'Segment Id' },
  { key: 'segmentNameEN', label: 'Segment' },
  { key: 'recordsCount', label: 'Records' },
]

const fields = [
  { key: 'segmentId', label: 'Segment Id', required: true, lockOnEdit: true },
  { key: 'segmentNameEN', label: 'Segment Name' },
]

export default function FinanceCalculatorPage() {
  return (
    <GenericCrudPage title="Finance Calculator" service={service} columns={columns} fields={fields} enableStatusFilter={false} />
  )
}
