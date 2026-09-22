import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'risk',
  base: 'data',
  urls: {
  "fetchAll": "risk/getAll",
  "create": "risk/create",
  "update": "risk/update",
  "delete": "risk/delete"
},
  idKeys: ["id","riskCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
