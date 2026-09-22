import { describe, it, expect } from 'vitest'
import service from '../card_spendService'

describe('card_spendService', () => {
  it('exposes Card Spend endpoints', () => {
    expect(service.urls.fetchAll).toBe('card-spend/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
