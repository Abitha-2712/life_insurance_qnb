import { describe, it, expect } from 'vitest'
import service from '../Apply_sub_productService'

describe('Apply_sub_productService', () => {
  it('uses bko-subProduct endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-subProduct/fetchAll')
    expect(service.urls.create).toBe('bko-subProduct/post')
  })
})
