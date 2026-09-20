import { describe, it, expect } from 'vitest'
import service from '../cheque_depositService'

describe('cheque_depositService', () => {
  it('exposes Cheque Deposit endpoints', () => {
    expect(service.urls.fetchAll).toBe('cheque-deposit/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
