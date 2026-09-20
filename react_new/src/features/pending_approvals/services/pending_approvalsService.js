/** Pending approvals — SoftFetch list/action.
 * Flutter pending_approval.dart exposes graphql for counts; list path is pending-approval/list (BO).
 * WFC graphql returns 404 on this insurance stack — count stays soft-fail / alternate count URL.
 */
import { createCrudService } from '@/features/common/crud/createCrudService'
import { dashboardUrls } from '@/core/api/urls/dashboardUrls'
import { apiRequest, isApiSuccess, API_SUCCESS_CODE } from '@/core/api/client'

const service = createCrudService({
  name: 'pending_approvals',
  base: 'wfc',
  urls: {
    fetchAll: 'pending-approval/list',
    create: 'pending-approval/action',
    update: 'pending-approval/action',
    delete: 'pending-approval/action',
  },
  idKeys: ['id', 'requestId', 'approvalId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.requestId || row.approvalId || ''),
    requestId: row.requestId || row.approvalId || '',
    requestType: row.requestType || row.type || '',
    requestedBy: row.requestedBy || row.maker || row.createdBy || '',
    requestedOn: row.requestedOn || row.createdOn || row.requestDate || '',
    moduleName: row.moduleName || row.module || '',
    action: row.action || row.requestAction || '',
    approvalStatus: row.approvalStatus || row.workflowStatus || row.status || 'PENDING',
    comments: row.comments || row.remark || '',
    status: row.status === 'PENDING' || row.status === 'APPROVED' || row.status === 'REJECTED'
      ? 'Y'
      : row.status || 'Y',
  }),
})

export async function fetchPendingCount() {
  try {
    const res = await apiRequest(dashboardUrls.pendingRequestCount, {
      base: 'wfc',
      method: 'POST',
      body: {},
    })
    if (res.ok || isApiSuccess(res.data)) {
      const raw = res.data?.data ?? res.data
      const count = typeof raw === 'number' ? raw : Number(raw?.count ?? raw?.total ?? 0)
      return { count, raw: res.data }
    }
  } catch {
    /* soft-fail */
  }
  return { count: 0 }
}

export async function approveRequest(row, comments = '') {
  return service.save({
    ...row,
    approvalStatus: 'APPROVED',
    action: 'APPROVE',
    comments,
  })
}

export async function rejectRequest(row, comments = '') {
  return service.save({
    ...row,
    approvalStatus: 'REJECTED',
    action: 'REJECT',
    comments,
  })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
