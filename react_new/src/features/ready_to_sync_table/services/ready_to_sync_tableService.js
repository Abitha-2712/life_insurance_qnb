import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { syncTableUrls } from '@/core/api/urls/sync_tableUrls'

const service = createCrudService({
  name: 'ready_to_sync_table',
  urls: {
    fetchAll: syncTableUrls.tableList,
    create: syncTableUrls.saveOrUpdate,
    update: syncTableUrls.saveOrUpdate,
    delete: syncTableUrls.refresh,
  },
  idKeys: ['id', 'tableName'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.tableName || ''),
    tableName: row.tableName || row.name || '',
    schemaName: row.schemaName || row.schema || '',
    ready: row.ready || row.isReady || 'Y',
    pendingChanges: String(row.pendingChanges ?? row.pending ?? ''),
    lastValidated: row.lastValidated || row.validatedAt || '-',
    lastSynced: row.lastSynced || row.syncedAt || '-',
    status: row.status || 'Y',
  }),
})

export async function refreshTables() {
  try {
    const res = await apiRequest(syncTableUrls.refresh, {
      base: 'data',
      method: 'POST',
      body: {},
    })
    return res.data || { status: { code: API_SUCCESS_CODE } }
  } catch {
    return { status: { code: API_SUCCESS_CODE }, offline: true }
  }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
