import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'western_union_email',
  base: 'data',
  urls: {
  "fetchAll": 'BoLookUp/list',
  "create": "wu-email/save",
  "update": "wu-email/save",
  "delete": "wu-email/delete"
},
  idKeys: ["id","email"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
