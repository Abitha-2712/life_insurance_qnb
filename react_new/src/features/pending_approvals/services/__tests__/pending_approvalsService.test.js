import { describe, it, expect } from 'vitest'
import service, { fetchPendingCount, approveRequest, rejectRequest } from '../pending_approvalsService'

describe('pending_approvalsService', () => {
  it('uses pending-approval SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('pending-approval/list')
    expect(service.urls.update).toBe('pending-approval/action')
  })

  it('fetchPendingCount returns a count', async () => {
    const res = await fetchPendingCount()
    expect(typeof res.count).toBe('number')
  })

  it('approve/reject helpers set approvalStatus', async () => {
    const row = { id: '1', requestId: 'PA-1001', requestType: 'USER' }
    const a = await approveRequest(row, 'ok')
    expect(a.status).toBeDefined()
    const r = await rejectRequest(row, 'no')
    expect(r.status).toBeDefined()
  })
})
