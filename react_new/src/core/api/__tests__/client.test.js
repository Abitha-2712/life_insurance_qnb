import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiRequest, isApiSuccess, API_SUCCESS_CODE, deriveServiceIdHidden } from '../client'

// deriveServiceId is not exported — test via request headers
describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ status: { code: API_SUCCESS_CODE }, data: [] }),
        headers: new Headers(),
      })),
    )
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('isApiSuccess checks status.code', () => {
    expect(isApiSuccess({ status: { code: API_SUCCESS_CODE } })).toBe(true)
    expect(isApiSuccess({ status: { code: '999' } })).toBe(false)
    expect(isApiSuccess(null)).toBe(false)
  })

  it('apiRequest sends Flutter CommonRequestHeaders', async () => {
    const res = await apiRequest('master/city/fetchAll', {
      method: 'POST',
      auth: false,
      body: {},
    })
    expect(res.ok).toBe(true)
    expect(fetch).toHaveBeenCalled()
    const [, opts] = fetch.mock.calls[0]
    expect(opts.headers.channel).toBe('BO')
    expect(opts.headers['App-Id']).toBeTruthy()
    expect(opts.credentials).toBe('include')
  })

  it('apiRequest derives serviceId when auth=true', async () => {
    await apiRequest('bko-user/fetchAll', { method: 'POST', body: {}, auth: true })
    const [, opts] = fetch.mock.calls[0]
    expect(opts.headers.serviceId).toBe('BO_bko-user/fetchAll')
  })
})
