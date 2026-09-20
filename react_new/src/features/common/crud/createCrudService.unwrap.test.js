import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock api client before importing factory
vi.mock('@/core/api/client', () => {
  const API_SUCCESS_CODE = '000000'
  return {
    API_SUCCESS_CODE,
    isApiSuccess: (p) => p?.status?.code === API_SUCCESS_CODE || p?.status == null,
    apiStatusDescription: () => 'err',
    ApiError: class ApiError extends Error {},
    apiRequest: vi.fn(),
  }
})

import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'

describe('createCrudService SoftFetch unwrapList', () => {
  beforeEach(() => {
    apiRequest.mockReset()
  })

  it('unwraps flat SoftFetch data array', async () => {
    apiRequest.mockResolvedValue({
      ok: true,
      status: 200,
      data: { status: { code: '000000' }, data: [{ id: 1, name: 'a' }] },
    })
    const svc = createCrudService({ name: 't', urls: { fetchAll: 'x' }, base: 'data' })
    const res = await svc.fetchAll()
    expect(res.data).toHaveLength(1)
    expect(res.data[0].name).toBe('a')
  })

  it('unwraps nested SoftFetch customers list (onboarding)', async () => {
    apiRequest.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        status: { code: '000000' },
        data: { customers: [{ stateId: 5, customerId: 1 }], details: {} },
      },
    })
    const svc = createCrudService({
      name: 'onboarding',
      urls: { fetchAll: 'customerOnboarding/getAll' },
      base: 'data',
      idKeys: ['stateId', 'customerId'],
    })
    const res = await svc.fetchAll()
    expect(res.data).toHaveLength(1)
    expect(res.data[0].customerId).toBe(1)
  })

  it('unwraps nested SoftFetch eipoList', async () => {
    apiRequest.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        status: { code: '000000' },
        data: { includeNoneQatariCustomers: true, eipoList: [{ id: 9, companyId: 'C1' }] },
      },
    })
    const svc = createCrudService({ name: 'eipo', urls: { fetchAll: 'eipo' }, base: 'data' })
    const res = await svc.fetchAll()
    expect(res.data[0].companyId).toBe('C1')
  })

  it('applies SoftFetch mapRow field aliases', async () => {
    apiRequest.mockResolvedValue({
      ok: true,
      status: 200,
      data: { status: { code: '000000' }, data: [{ categoryEn: 'Morning', id: 2 }] },
    })
    const svc = createCrudService({
      name: 'athkar',
      urls: { fetchAll: 'athkar/fetchAll' },
      base: 'data',
      mapRow: (row) => ({ ...row, titleEn: row.categoryEn }),
    })
    const res = await svc.fetchAll()
    expect(res.data[0].titleEn).toBe('Morning')
  })
})
