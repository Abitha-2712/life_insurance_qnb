import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'instant_finance',
  urls: {
    fetchAll: 'instant-finance/getAll',
    create: 'instant-finance/save',
    update: 'instant-finance/save',
    delete: 'instant-finance/delete',
  },
  idKeys: ["id","productCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.productCode || row.code || ''),
    productCode: row.productCode || row.code || '',
    productName: row.productName || row.name || row.englishLabel || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    minAmount: String(row.minAmount ?? ''),
    maxAmount: String(row.maxAmount ?? ''),
    maxTenure: String(row.maxTenure ?? row.tenure ?? ''),
    profitRate: String(row.profitRate ?? row.rate ?? ''),
    segmentCode: row.segmentCode || row.segment || '',
    currency: row.currency || 'QAR',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
