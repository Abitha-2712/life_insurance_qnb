import { describe, it, expect } from 'vitest'
import service from '../finance_offerService'

describe('finance_offerService', () => {
  it('uses finance-offer SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('finance-offer/getAll')
    expect(service.urls.create).toBe('finance-offer/create')
  })
})
