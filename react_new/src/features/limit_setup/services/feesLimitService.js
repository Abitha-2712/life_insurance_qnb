import { createCrudService } from '@/features/common/crud/createCrudService'
import { transferControlUrls } from '@/core/api/urls/transfer_controlUrls'

function resolveLimitCategory(row) {
  const raw = String(
    row.limitCategory ||
      row.customerType ||
      row.limitType ||
      row.category ||
      row.typeName ||
      '',
  ).toLowerCase()
  if (raw.includes('class')) return 'class'
  if (raw.includes('segment')) return 'segment'
  if (raw.includes('default') || raw.includes('type')) return 'default'
  if (raw.includes('rim') || raw.includes('customer')) return 'customer'
  return 'customer'
}

const service = createCrudService({
  name: 'fees_limit',
  base: 'data',
  urls: {
    fetchAll: transferControlUrls.getAll,
    create: transferControlUrls.save,
    update: transferControlUrls.save,
    delete: transferControlUrls.save,
  },
  idKeys: ['id', 'feeCode', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.feeCode || row.code || ''),
    feeCode: row.feeCode || row.code || '',
    feeName: row.feeName || row.name || '',
    transferType: row.transferType || row.type || '',
    channel: row.channel || 'ALL',
    feeAmount: String(row.feeAmount ?? row.amount ?? ''),
    feePercent: String(row.feePercent ?? row.percent ?? ''),
    minFee: String(row.minFee ?? ''),
    maxFee: String(row.maxFee ?? ''),
    currency: row.currency || 'QAR',
    status: row.status || 'Y',
    limitCategory: resolveLimitCategory(row),
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
