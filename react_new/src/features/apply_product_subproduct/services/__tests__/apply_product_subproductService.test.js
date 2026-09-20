import { describe, it, expect } from 'vitest'
import service from '../apply_product_subproductService'

describe('apply_product_subproductService', () => {
  it('uses csubproduct endpoints', () => {
    expect(service.urls.fetchAll).toBe('csubproduct/getAll')
    expect(service.urls.create).toBe('csubproduct/create')
  })
})
