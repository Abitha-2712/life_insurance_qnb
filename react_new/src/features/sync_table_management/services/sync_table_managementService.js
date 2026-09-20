import { createCrudService } from '@/features/common/crud/createCrudService'
import { syncTableUrls } from '@/core/api/urls/sync_tableUrls'
import { apiRequest, isApiSuccess, API_SUCCESS_CODE } from '@/core/api/client'

const service = createCrudService({
  name: 'sync_table_management',
  urls: {
    fetchAll: syncTableUrls.tableList,
    create: syncTableUrls.saveOrUpdate,
    update: syncTableUrls.saveOrUpdate,
    delete: syncTableUrls.saveOrUpdate,
  },
  idKeys: ['id', 'tableName', 'tableId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.tableName || row.tableId || ''),
    tableName: row.tableName || row.name || '',
    schemaName: row.schemaName || row.schema || '',
    lastSync: row.lastSync || row.lastSyncDate || row.syncedAt || '-',
    syncStatus: row.syncStatus || row.state || 'READY',
    recordCount: String(row.recordCount ?? row.count ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export async function refreshTables() {
  try {
    const res = await apiRequest(syncTableUrls.refresh, { base: 'bo', method: 'POST', body: {} })
    if (res.ok || isApiSuccess(res.data)) {
      return { status: { code: API_SUCCESS_CODE }, raw: res.data }
    }
  } catch {
    /* offline */
  }
  return { status: { code: API_SUCCESS_CODE }, offline: true }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
