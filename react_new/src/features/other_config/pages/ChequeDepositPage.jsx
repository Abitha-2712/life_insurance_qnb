import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/cheque_depositService'

/** Flutter cheque-deposit/get-all */
const columns = [
  { key: 'segmentName', label: 'Segment' },
  { key: 'minAmount', label: 'Min Amount' },
  { key: 'maxAmount', label: 'Max Amount' },
  { key: 'maxDepositsPerDay', label: 'Max / Day' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'segmentName', label: 'Segment', required: true },
  { key: 'minAmount', label: 'Min Amount' },
  { key: 'maxAmount', label: 'Max Amount' },
  { key: 'maxDepositsPerDay', label: 'Max Deposits Per Day' },
  { key: 'status', label: 'Status', type: 'status' },
]

export default function ChequeDepositPage() {
  return (
    <GenericCrudPage title="Cheque Deposit" service={service} columns={columns} fields={fields} />
  )
}
