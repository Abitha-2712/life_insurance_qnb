import { describe, it, expect } from 'vitest'
import service from '../countryService'

describe('countryService', () => {
  it('uses bko-country endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-country/fetchAll')
    expect(service.urls.create).toBe('bko-country/post')
  })
})
