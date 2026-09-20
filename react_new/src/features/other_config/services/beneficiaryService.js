import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'beneficiary',
  urls: {
  "fetchAll": '/api/v1/beneficiaries/view/cooling-pending',
  "create": "beneficiary/create",
  "update": "beneficiary/update",
  "delete": "beneficiary/delete"
},
  idKeys: ["id","beneficiaryType"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
