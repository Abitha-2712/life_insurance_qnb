import { describe, it, expect } from 'vitest'
import service from '../offer_discount_managementService'

describe('offer_discount_managementService', () => {
  it('uses offer/* endpoints', () => {
    expect(service.urls.fetchAll).toBe('offer/getAll')
    expect(service.urls.create).toBe('offer/create')
    expect(service.urls.update).toBe('offer/update')
    expect(service.urls.delete).toBe('offer/delete')
  })
})
