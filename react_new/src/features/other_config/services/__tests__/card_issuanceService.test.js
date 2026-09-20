import { describe, it, expect } from 'vitest'
import service from '../card_issuanceService'

describe('card_issuanceService', () => {
  it('exposes Card Issuance endpoints', () => {
    expect(service.urls.fetchAll).toBe('card-issuance/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
