import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'finance_calculator',
  base: 'data',
  urls: {
    fetchAll: 'finance-calculator/getall',
    create: 'finance-calculator/add',
    update: 'finance-calculator/add',
    delete: 'finance-calculator/delete',
  },
  idKeys: ["id","calcCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.calcCode || row.code || ''),
    calcCode: row.calcCode || row.code || '',
    calcName: row.calcName || row.name || row.englishLabel || '',
    calcNameAr: row.calcNameAr || row.arabicLabel || '',
    formula: row.formula || row.calcType || 'EMI',
    minTenure: String(row.minTenure ?? ''),
    maxTenure: String(row.maxTenure ?? ''),
    defaultRate: String(row.defaultRate ?? row.rate ?? ''),
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
