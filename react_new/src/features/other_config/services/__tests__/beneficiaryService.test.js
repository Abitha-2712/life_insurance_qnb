import { describe, it, expect } from 'vitest'
import service from '../beneficiaryService'

describe('beneficiaryService', () => {
  it('exposes Beneficiary Configuration endpoints', () => {
    expect(service.urls.fetchAll).toBe('beneficiary/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
