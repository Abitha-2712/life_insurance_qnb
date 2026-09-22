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
  mapRow: (row) => {
    const isInactive = ['N', 'NO', 'INACTIVE', '0', 'FALSE', 'IAC', 'INACT'].includes(
      String(row.status || '').toUpperCase().trim(),
    )
    return {
      ...row,
      id: String(row.id || row.domainCode || row.domainId || ''),
      domainId: row.domainId || row.domainCode || row.id || '',
      domainDesc: row.domainDesc || row.description || row.domainName || '',
      priority: String(row.priority ?? row.sequence ?? row.seq ?? ''),
      status: isInactive ? 'INACTIVE' : 'ACTIVE',
    }
  },
  buildCreateBody: (form) => {
    const isAct = ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(
      String(form.status || '').toUpperCase().trim(),
    )
    return {
      domainId: form.domainId,
      domainDesc: form.domainDesc,
      priority: form.priority,
      status: isAct ? 'ACT' : 'IAC',
      action: 'ADD',
    }
  },
  buildUpdateBody: (form) => {
    const isAct = ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(
      String(form.status || '').toUpperCase().trim(),
    )
    return {
      domainId: form.domainId,
      domainDesc: form.domainDesc,
      priority: form.priority,
      status: isAct ? 'ACT' : 'IAC',
      action: 'UPDATE',
    }
  },
  buildDeleteBody: (id, row) => ({ name: row?.domainId || id }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
