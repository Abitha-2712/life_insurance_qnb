import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'connectivity_hub',
  base: 'data',
  urls: {
  "fetchAll": 'third-party/get-all',
  "create": 'third-party/create',
  "update": 'third-party/update',
  "delete": 'third-party/delete'
},
  idKeys: ["id","hubCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
