import { createCrudService } from '@/features/common/crud/createCrudService'

/** Favorite — SoftFetch CRUD (inferred BO paths; deepen when Flutter datasource available). */
const service = createCrudService({
  name: 'favorite',
  urls: {
  "fetchAll": "api/v1/favorite-master/list",
  "create": "api/v1/favorite-master/add",
  "update": "api/v1/favorite-master/edit",
  "delete": "api/v1/favorite-master/delete"
},
  idKeys: ["id","favoriteCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
