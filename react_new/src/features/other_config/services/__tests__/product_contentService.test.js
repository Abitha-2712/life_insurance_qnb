import { describe, it, expect } from 'vitest'
import service from '../product_contentService'

describe('product_contentService', () => {
  it('exposes Product Content Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('product-content/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
