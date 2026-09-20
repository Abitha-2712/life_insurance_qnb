import { describe, it, expect } from 'vitest'
import service from '../riskService'

describe('riskService', () => {
  it('exposes Risk Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('risk/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
