import { describe, it, expect } from 'vitest'
import service from '../merchant_managementService'

describe('merchant_managementService', () => {
  it('uses SoftFetch merchant endpoints', () => {
    expect(service.urls.fetchAll).toBe('merchant/getAll')
    expect(service.urls.create).toBe('merchant/create')
  })
})
