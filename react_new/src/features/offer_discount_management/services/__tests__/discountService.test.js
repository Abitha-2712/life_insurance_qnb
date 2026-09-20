import { describe, it, expect } from 'vitest'
import service from '../discountService'

describe('discountService', () => {
  it('uses offer endpoints for discount CRUD', () => {
    expect(service.urls.fetchAll).toBe('offer/getAll')
  })
})
