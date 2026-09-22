import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'
import { pendingApprovalUrls } from '@/core/api/urls/pending_approvalUrls'
import { dashboardUrls } from '@/core/api/urls/dashboardUrls'

const service = createCrudService({
  name: 'workflow_new',
  urls: {
    fetchAll: 'pending-request/workflow/list',
    create: 'pending-request/workflow/action',
    update: 'pending-request/workflow/action',
    delete: 'pending-request/workflow/action',
  },
  idKeys: ['id', 'requestId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.requestId || ''),
    requestId: row.requestId || row.id || '',
    requestType: row.requestType || row.type || '',
    requestedBy: row.requestedBy || row.userId || '',
    status: row.status || 'PENDING',
  }),
})

export async function fetchPendingCount() {
  return apiRequest(dashboardUrls.pendingRequestCount, { method: 'POST', body: {} })
}

export async function fetchSubProductCountGraphql(query) {
  return apiRequest(pendingApprovalUrls.subProductCount || 'graphql', {
    base: 'wfc',
    method: 'POST',
    body: typeof query === 'string' ? { query } : query || { query: '{ __typename }' },
  })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
