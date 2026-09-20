import { describe, it, expect } from 'vitest'
import service from '../financeService'

describe('financeService', () => {
  it('uses salary-advance SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('salary-advance/getAll')
    expect(service.urls.create).toBe('salary-advance/save')
  })
})
