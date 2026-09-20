import { describe, it, expect } from 'vitest'
import service from '../direct_remittanceService'

describe('direct_remittanceService', () => {
  it('exposes Direct Remittance endpoints', () => {
    expect(service.urls.fetchAll).toBe('direct-remittance/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
