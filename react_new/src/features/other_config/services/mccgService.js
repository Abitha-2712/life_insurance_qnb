import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'mccg',
  base: 'data',
  urls: {
  "fetchAll": "merchantmaster/mccg/getAll",
  "create": "merchantmaster/mccg/create",
  "update": "merchantmaster/mccg/update",
  "delete": "merchantmaster/mccg/delete"
},
  idKeys: ["id","mccgCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
