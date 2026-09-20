import { createCrudService } from '@/features/common/crud/createCrudService'
import { domainManagementUrls } from '@/core/api/urls/domain_managementUrls'

const service = createCrudService({
  base: 'wfc',
  name: 'domain_management',
  urls: {
    fetchAll: domainManagementUrls.fetchAllDomain,
    create: domainManagementUrls.saveDomain,
    update: domainManagementUrls.saveDomain,
    delete: domainManagementUrls.deleteDomain,
  },
  idKeys: ["id","domainCode","domainId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.domainCode || row.domainId || ''),
    domainCode: row.domainCode || row.code || '',
    domainName: row.domainName || row.englishLabel || row.name || '',
    domainNameAr: row.domainNameAr || row.arabicLabel || '',
    description: row.description || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
