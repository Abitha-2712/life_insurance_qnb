import { createCrudService } from '@/features/common/crud/createCrudService'
import { crmServiceUrls } from '@/core/api/urls/crm_serviceUrls'

const service = createCrudService({
  name: 'customer_service',
  base: 'data',
  urls: {
    fetchAll: crmServiceUrls.fetchAll,
    create: crmServiceUrls.add,
    update: crmServiceUrls.update,
    delete: crmServiceUrls.delete,
  },
  idKeys: ["id","serviceCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.serviceCode || row.code || ''),
    serviceCode: row.serviceCode || row.code || '',
    serviceName: row.serviceName || row.englishLabel || row.name || '',
    serviceNameAr: row.serviceNameAr || row.arabicLabel || '',
    category: row.category || row.serviceCategory || '',
    priority: row.priority || 'MEDIUM',
    slaHours: String(row.slaHours ?? row.sla ?? ''),
    description: row.description || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
