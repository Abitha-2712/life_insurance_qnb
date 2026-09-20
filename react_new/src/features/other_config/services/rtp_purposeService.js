import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'rtp_purpose',
  base: 'data',
  urls: {
  "fetchAll": 'BoLookUp/list',
  "create": "rtp-purpose/create",
  "update": "rtp-purpose/update",
  "delete": "rtp-purpose/delete"
},
  idKeys: ["id","purposeCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
