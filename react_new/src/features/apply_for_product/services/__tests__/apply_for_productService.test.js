import { describe, it, expect } from 'vitest'
import service from '../apply_for_productService'

describe('apply_for_productService', () => {
  it('uses bko-product endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-product/fetchAll')
    expect(service.urls.create).toBe('bko-product/post')
  })
})
