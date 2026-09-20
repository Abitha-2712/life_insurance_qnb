import { describe, it, expect } from 'vitest'
import service from '../finance_calculatorService'

describe('finance_calculatorService', () => {
  it('uses finance-calculator SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('finance-calculator/getAll')
  })
})
