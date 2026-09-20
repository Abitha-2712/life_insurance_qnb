import { createCrudService } from '@/features/common/crud/createCrudService'
import { databaseUrls } from '@/core/api/urls/databaseUrls'

/** Database Configuration — CSV databaseUrls (dbconfig/*). */
const service = createCrudService({
  name: 'data_base_configuration',
  urls: {
    fetchAll: databaseUrls.fetchAlldatabasefetch,
    create: databaseUrls.databasepost,
    update: databaseUrls.databasepost,
    delete: databaseUrls.databasepost,
  },
  idKeys: ['id', 'dbName', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.dbName || row.code || ''),
    dbName: row.dbName || row.name || '',
    host: row.host || '',
    port: String(row.port ?? ''),
    schemaName: row.schemaName || row.schema || '',
    status: row.status || 'Y',
  }),
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
