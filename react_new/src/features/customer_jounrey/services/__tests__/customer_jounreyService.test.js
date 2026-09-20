import { describe, it, expect } from 'vitest'
import service from '../customer_jounreyService'

describe('customer_jounreyService', () => {
  it('uses SoftFetch customer-journey endpoints', () => {
    expect(service.urls.fetchAll).toBe('customer-journey/getAll')
  })
  it('seed includes channel/segment', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].channel).toBeTruthy()
  })
})
