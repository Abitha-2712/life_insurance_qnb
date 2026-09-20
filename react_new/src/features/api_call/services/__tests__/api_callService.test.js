import { describe, it, expect } from 'vitest'
import service from '../api_callService'

describe('api_callService', () => {
  it('uses SoftFetch api-call endpoints', () => {
    expect(service.urls.fetchAll).toBe('api-call/getAll')
  })
  it('seed includes method and endpoint', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].httpMethod).toBeTruthy()
    expect(res.data[0].endpoint).toBeTruthy()
  })
})
