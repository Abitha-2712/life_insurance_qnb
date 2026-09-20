import { createCrudService } from '@/features/common/crud/createCrudService'
import { transferControlUrls } from '@/core/api/urls/transfer_controlUrls'

const service = createCrudService({
  name: 'transfer_config',
  base: 'data',
  urls: {
    fetchAll: transferControlUrls.getAll,
    create: transferControlUrls.save,
    update: transferControlUrls.save,
    delete: transferControlUrls.save,
  },
  idKeys: ['id', 'transferType'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.transferType || ''),
    transferType: row.transferType || row.type || '',
    channel: row.channel || 'ALL',
    segmentCode: row.segmentCode || '',
    limitAmount: row.limitAmount ?? row.limit ?? '',
    dailyLimit: row.dailyLimit || '',
    currency: row.currency || 'QAR',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
