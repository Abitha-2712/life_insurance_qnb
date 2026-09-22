import { describe, it, expect } from 'vitest'
import service from '../gateway_syncService'

describe('gateway_syncService', () => {
  it('uses gateway SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('gateway/getAll')
    expect(service.urls.create).toBe('gateway/save')
  })
})
