import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'mq_configuration',
  base: 'data',
  urls: {
  "fetchAll": "mq-config/getAll",
  "create": "mq-config/save",
  "update": "mq-config/save",
  "delete": "mq-config/delete"
},
  idKeys: ["id","queueName"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
