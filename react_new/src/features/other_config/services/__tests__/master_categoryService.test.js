import { describe, it, expect } from 'vitest'
import service from '../master_categoryService'

describe('master_categoryService', () => {
  it('exposes Master Category endpoints', () => {
    expect(service.urls.fetchAll).toBe('master-category/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
