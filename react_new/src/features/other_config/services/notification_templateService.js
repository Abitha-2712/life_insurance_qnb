import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'notification_template',
  base: 'data',
  urls: {
  "fetchAll": 'BoLookUp/list',
  "create": "notification-template/save",
  "update": "notification-template/save",
  "delete": "notification-template/delete"
},
  idKeys: ["id","templateCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
