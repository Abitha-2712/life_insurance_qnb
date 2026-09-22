import { createCrudService } from '@/features/common/crud/createCrudService'
import { branchLocatorUrls } from '@/core/api/urls/branch_locatorUrls'

/** Flutter branch_locator datasource — dataurl + branch-locator/* paths. */
const service = createCrudService({
  name: 'branch_locator',
  base: 'data',
  urls: {
    fetchAll: branchLocatorUrls.branchgetall,
    create: branchLocatorUrls.branchsave,
    update: branchLocatorUrls.branchupdate,
    delete: branchLocatorUrls.branchdelete,
  },
  idKeys: ['id', 'branchCode', 'locatorId'],
})
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
