import { describe, it, expect } from 'vitest'
import service from '../afaqService'

describe('afaqService', () => {
  it('exposes Afaq Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('afaq/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
