import { describe, it, expect } from 'vitest'
import service from '../currencyService'

describe('currencyService', () => {
  it('uses bko-currency endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-currency/fetchAll')
    expect(service.urls.create).toBe('bko-currency/post')
  })
})
