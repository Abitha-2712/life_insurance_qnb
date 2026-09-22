import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter eIPOCompanyConfigUrl — eipo-company-config/get-all (data.eipoList) */
const service = createCrudService({
  name: 'eipo',
  base: 'data',
  urls: {
    fetchAll: 'eipo-company-config/get-all',
    create: 'eipo-company-config/create',
    update: 'eipo-company-config/update',
    delete: 'eipo-company-config/delete',
  },
  idKeys: ['id', 'companyId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.companyId || ''),
    companyId: row.companyId || '',
    companyNameEn: row.companyNameEn || row.companyName || '',
    companyNameAr: row.companyNameAr || '',
    status: row.status || row.customerEligibility || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
