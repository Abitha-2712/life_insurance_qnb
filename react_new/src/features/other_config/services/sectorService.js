import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'sector',
  base: 'data',
  urls: {
  "fetchAll": "sector/getAll",
  "create": "sector/create",
  "update": "sector/update",
  "delete": "sector/delete"
},
  idKeys: ["id","sectorCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
