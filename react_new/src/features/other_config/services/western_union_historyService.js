import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'western_union_history',
  base: 'data',
  urls: {
  "fetchAll": 'BoLookUp/list',
  "create": "wu-history/save",
  "update": "wu-history/save",
  "delete": "wu-history/delete"
},
  idKeys: ["id","referenceNo"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
