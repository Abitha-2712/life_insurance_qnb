import { describe, it, expect } from 'vitest'
import service from '../direct_remittance_typeService'

describe('direct_remittance_typeService', () => {
  it('exposes Direct Remittance Type endpoints', () => {
    expect(service.urls.fetchAll).toBe('direct-remittance-type/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
