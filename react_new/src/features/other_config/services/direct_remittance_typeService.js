import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'direct_remittance_type',
  base: 'data',
  urls: {
  "fetchAll": "DirectRemittanceType/getAll",
  "create": "DirectRemittanceType/create",
  "update": "DirectRemittanceType/update",
  "delete": "DirectRemittanceType/delete"
},
  idKeys: ["id","typeCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
