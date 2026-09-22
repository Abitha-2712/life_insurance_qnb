import { describe, it, expect } from 'vitest'
import service from '../instant_financeService'

describe('instant_financeService', () => {
  it('uses instant-finance SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('instant-finance/getAll')
    expect(service.urls.delete).toBe('instant-finance/delete')
  })
})
