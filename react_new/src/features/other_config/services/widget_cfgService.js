import { createCrudService } from '@/features/common/crud/createCrudService'

/** Widget Configuration — SoftFetch CRUD (inferred BO paths; deepen when Flutter datasource available). */
const service = createCrudService({
  name: 'widget_cfg',
  urls: {
  "fetchAll": "api/v1/widget-master/list",
  "create": "api/v1/widget-master/add",
  "update": "api/v1/widget-master/edit",
  "delete": "api/v1/widget-master/delete"
},
  idKeys: ["id","widgetCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
