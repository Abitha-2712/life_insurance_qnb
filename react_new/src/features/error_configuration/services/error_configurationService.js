import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'error_configuration',
  base: 'data',
  urls: {
    fetchAll: 'error-config/getAll',
    create: 'error-config/create',
    update: 'error-config/update',
    delete: 'error-config/delete',
  },
  idKeys: ['id', 'configCode', 'code'],
})

export function fetchAll() {
  return service.fetchAll()
}
export function save(payload) {
  return service.save(payload)
}
export function remove(id, row) {
  return service.remove(id, row)
}
export { service }
export default service
