import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'charity',
  base: 'data',
  urls: {
  "fetchAll": "charity/getAll",
  "create": "charity/create",
  "update": "charity/update",
  "delete": "charity/delete"
},
  idKeys: ["id","charityCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
