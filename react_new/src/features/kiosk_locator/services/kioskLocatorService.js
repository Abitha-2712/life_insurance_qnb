import { createCrudService } from '@/features/common/crud/createCrudService'

/** Kiosk locator â€” SoftFetch (patterned on branch-locator Flutter endpoints). */
const service = createCrudService({
  name: 'kiosk_locator',
  base: 'data',
  urls: {
    fetchAll: 'kiosk/getAll',
    create: 'kiosk-locator/add',
    update: 'kiosk-locator/update',
    delete: 'kiosk-locator/delete',
  },
  idKeys: ['id', 'kioskCode'],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
