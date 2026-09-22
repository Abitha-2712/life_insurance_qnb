import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'rtp_account_type',
  base: 'data',
  urls: {
  "fetchAll": 'account-class/dropdown',
  "create": "rtp-account-type/create",
  "update": "rtp-account-type/update",
  "delete": "rtp-account-type/delete"
},
  idKeys: ["id","accountTypeCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
