import { createCrudService } from '@/features/common/crud/createCrudService'
import { atmLocatorUrls } from '@/core/api/urls/atm_locatorUrls'

/** Flutter atm_locator — dataurl; AUTH probe OK: POST data/atm/getAll. */
const service = createCrudService({
  name: 'atm_locator',
  base: 'data',
  urls: {
    fetchAll: atmLocatorUrls.fetchAtmLocatorkey,
    create: atmLocatorUrls.addatmlocator,
    update: atmLocatorUrls.updateAtmLocator,
    delete: atmLocatorUrls.deleteAtmLocator,
  },
  idKeys: ['id', 'atmCode', 'locatorId'],
})
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
