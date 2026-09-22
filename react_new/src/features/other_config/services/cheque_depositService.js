import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter ChequeDepositUrl — cheque-deposit/get-all */
const service = createCrudService({
  name: 'cheque_deposit',
  base: 'data',
  urls: {
    fetchAll: 'cheque-deposit/get-all',
    create: 'cheque-deposit/add',
    update: 'cheque-deposit/update',
    delete: 'cheque-deposit/delete',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || ''),
    segmentName: row.segmentName || '',
    minAmount: row.minAmount ?? '',
    maxAmount: row.maxAmount ?? '',
    maxDepositsPerDay: row.maxDepositsPerDay ?? '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
