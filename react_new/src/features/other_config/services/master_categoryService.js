import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'master_category',
  base: 'data',
  urls: {
  "fetchAll": 'gateway_audit/getAll',
  "create": "master-category/create",
  "update": "master-category/update",
  "delete": "master-category/delete"
},
  idKeys: ["id","categoryCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
